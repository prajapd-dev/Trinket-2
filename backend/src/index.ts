import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.ts";
import cors from "cors";
import multer from "multer";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import PrettyJSON from "@topcli/pretty-json";
import type { CustomBooth, MarketEvent } from "./config/types.ts";

dotenv.config();
const app = express();

// this middleware allows us to send the request body
// as it parses incoming request bodies that contain JSON payloads
// without this, if we were to send a JSON payload in a request
// it would be undefined because express wouldn't know how to parse
// the incoming data
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3000;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
  throw new Error("AWS environment variables are missing");
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region,
});

app.get("/api/custom_market/:user_id", async (req, res) => {
  const { user_id } = req.params;
  console.log(
    "app.get market/userid: retrieving market data from index.ts with userid: ",
    user_id
  );
  try {
    const getMarkets = await sql`
        SELECT * FROM custom_market WHERE user_id = ${user_id} ORDER BY startDate DESC`;
    console.log(
      "app.get: markets retrived by user id: ",
      user_id,
      "markets",
      PrettyJSON(getMarkets)
    );

    for (const market of getMarkets) {
      const key = `user-uploads/${user_id}/${market.img_name}`;
      const getObjectParams = {
        Bucket: bucketName,
        Key: key,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      market.img_url = url;
    }
    return res.status(200).json({
      markets: getMarkets,
      message: "app.get market/user_id: Successfully fetched markets",
      success: true,
    });
  } catch (error) {
    console.log("app.get market/user_id: error getting market event", error);
    res.status(500).json({
      markets: [],
      message: `app.get market/user_id: Internal Server Error, could not fetch market events made by user: ${user_id}`,
      success: false,
    });
  }
});

app.get("/api/custom_booth/:marketID/:userID", async (req, res) => {
  const { marketID, userID } = req.params;
  console.log(
    "app.get booth/marketid: retrieving booth data from index.ts with marketID: ",
    marketID
  );
  try {
    const getBooths = await sql`
        SELECT * FROM custom_booth WHERE market_id = ${marketID} AND user_id = ${userID} ORDER BY name ASC`;
    console.log(
      "app.get: booths retrived by market id: ",
      marketID,
      "booths",
      PrettyJSON(getBooths)
    );
    return res.status(200).json({
      message: "Successfully fetched booths",
      booths: getBooths,
    });
  } catch (error) {
    console.log("app.get booth/marketid: error getting booths", error);
    res.status(500).json({
      message: `Internal Server Error, could not fetch booths for market: ${marketID}`,
    });
  }
});

app.post(
  "/api/custom_market/:userID",
  upload.single("image"),
  async (req, res) => {
    const { userID } = req.params;
    const { name, startdate, enddate, img_url } = req.body;
    const key = `user-uploads/${userID}/${req.file?.originalname}`;

    console.log(
      "app.post custom_market/userid: req.body: ",
      JSON.stringify(req.body)
    );
    console.log("app.post custom_market/userid: req.file: ", req.file);
    try {
      if (req.file !== undefined) {
        const params: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const insertMarket = await sql`
            INSERT INTO custom_market(user_id, name, startdate, enddate, img_name, img_url)
            VALUES (${userID}, ${name}, ${startdate}, ${enddate}, ${req.file.originalname}, ${img_url})
            RETURNING *
        `;
        return res.status(201).json({
          message: "successfully uploaded image to s3 and updated record",
          insertMarket,
        });
      }
    } catch (error) {
      console.error(
        "Error getting image to post to S3 and/or inserting into table: ",
        error
      );
      return res.status(500).json({
        msesage: "internal error, issue posting to s3 and updating table",
      });
    }
  }
);

app.post("/api/custom_booth/:userID", async (req, res) => {
  const { userID } = req.params;
  const { boothName, boothNumber, location, marketId } = req.body;

  console.log(
    "app.post custom_booth/userid: req.body: ",
    JSON.stringify(req.body)
  );

  try {
    const insertBooth = await sql`
            INSERT INTO custom_booth(name, number, user_id, market_id, latitude, longitude)
            VALUES (${boothName}, ${boothNumber}, ${userID}, ${marketId}, ${location?.lat}, ${location?.lng})
            RETURNING *
        `;
    return res.status(201).json({
      message: "successfully created custom booth",
      insertBooth,
    });
  } catch (error) {
    console.error("Error inserting booth into table: ", error);
    return res.status(500).json({
      message: "internal error, issue inserting booth into table",
    });
  }
});

app.patch("/api/custom_booth/:boothID", async (req, res) => {
  const { boothID } = req.params;
  const updates = req.body as Partial<CustomBooth>;

  console.log("app.patch custom_booth updates: ", updates);
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "no fields to update" });
  }

  //check if booth exists under market
  const existing =
    await sql`SELECT * FROM custom_booth WHERE uuid = ${boothID}`;
  if (existing.length == 0) {
    return res.status(404).json({ error: "Booth not found" });
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let i = 1;

  // because we are creating the key values for the sql statement, it is 
  // important that the key matches the column name in the db
  for (const [key, value] of Object.entries(updates)) {
    setClauses.push(`${key} = $${i}`);
    if (key != "name") {
      values.push(Number(value));
    } else {
      values.push(value);
    }

    i++;
  }

  try {
    const query = `UPDATE custom_booth 
    SET ${setClauses.join(", ")}
    WHERE uuid = ${boothID}
    RETURNING *`;

    const updateBooth = await sql.query(query, values);
    return res.status(201).json({
      message: "app.patch: Booth updated successfully",
      updatedMarket: updateBooth,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "app.patch custom booth, Internal service error" });
  }
});

app.patch(
  "/api/custom_market/:market_uuid/:user_id",
  upload.single("image"),
  async (req, res) => {
    const { market_uuid, user_id } = req.params;
    const updates = req.body as Partial<MarketEvent>; // may contain any subset of fields

      console.log("app.patch custom_market updates: ", updates);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Check if market exists
    const existing =
      await sql`SELECT * FROM custom_market WHERE uuid = ${market_uuid}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: "Market not found" });
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }

    try {
      if (req.file !== undefined) {
        console.log("app.patch: uploading new image to S3");
        const key = `user-uploads/${user_id}/${req.file?.originalname}`;
        const params: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        setClauses.push(`img_name = $${i}`);
        values.push(req.file.originalname);
        i++;
        await s3.send(command);
      }

      const query = `
    UPDATE custom_market
    SET ${setClauses.join(", ")}
    WHERE uuid = ${market_uuid} AND user_id = ${user_id}
    RETURNING *;
  `;

      console.log("app.patch: update query: ", query);
      console.log("app.patch: update values: ", values);

      const updatedMarket = await sql.query(query, values);
      return res.status(200).json({
        message: "app.patch: Market updated successfully",
        updatedMarket: updatedMarket,
      });
    } catch {
      return res
        .status(500)
        .json({ error: "app.patch: Internal server error" });
    }
  }
);

app.get("/", (req, res) => {
  res.send("It's working");
});

app.listen(PORT, () => {
  console.log("Server is up and running on PORT: ", PORT);
});
