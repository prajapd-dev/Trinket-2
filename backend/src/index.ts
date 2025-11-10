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

app.get("/api/custom_market/:user_uuid", async (req, res) => {
  const { user_uuid } = req.params;
  console.log(
    "app.get market/user_uuid: retrieving market data from index.ts with user_uuid: ",
    user_uuid
  );
  try {
    const getMarkets: Partial<MarketEvent>[] = await sql`
        SELECT * FROM custom_market WHERE user_uuid = ${user_uuid} ORDER BY startDate DESC`;
    console.log(
      "app.get: markets retrived by user id: ",
      user_uuid,
      "markets",
      PrettyJSON(getMarkets)
    );

    for (const market of getMarkets) {
      if (!market.img_name) continue; 
      const key = `user-uploads/${user_uuid}/markets/${market.img_name}`;
      const getObjectParams = {
        Bucket: bucketName,
        Key: key,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      // add img_url from amazon s3 bucket - because img_url is not actually stored
      market.img_url = url;
    }
    return res.status(200).json({
      markets: getMarkets,
      message: "app.get market/user_uuid: Successfully fetched markets",
      success: true,
    });
  } catch (error) {
    console.log("app.get market/user_uuid: error getting market event", error);
    res.status(500).json({
      markets: [],
      message: `app.get market/user_uuid: Internal Server Error, could not fetch market events made by user: ${user_uuid}`,
      success: false,
    });
  }
});

app.get("/api/custom_booth/:market_uuid/:user_uuid", async (req, res) => {
  const { market_uuid, user_uuid } = req.params;
  console.log(
    "app.get booth/market_uuid: retrieving booth data from index.ts with market_uuid: ",
    market_uuid
  );
  try {
    const getBooths = await sql` SELECT b.* 
      FROM custom_booth b
      JOIN custom_market market ON b.market_uuid = market.uuid
      WHERE market.uuid = ${market_uuid}
      AND market.user_uuid = ${user_uuid}
      ORDER BY name ASC`;
    console.log(
      "app.get: booths retrived by market uuid: ",
      market_uuid,
      "booths",
      PrettyJSON(getBooths)
    );
    return res.status(200).json({
      message: "Successfully fetched booths",
      booths: getBooths,
    });
  } catch (error) {
    console.log("app.get booth/market_uuid: error getting booths", error);
    res.status(500).json({
      message: `Internal Server Error, could not fetch booths for market: ${market_uuid}`,
    });
  }
});

app.post(
  "/api/custom_market/:user_uuid",
  upload.single("image"),
  async (req, res) => {
    const { user_uuid } = req.params;
    const { name, startdate, enddate } = req.body;
    let img_name = null; 
    console.log(
      "app.post custom_market/user_uuid: req.body: ",
      JSON.stringify(req.body)
    );
    console.log("app.post custom_market/user_uuid: req.file: ", req.file);
    try {
      if (req.file !== undefined) {
        const key = `user-uploads/${user_uuid}/markets/${req.file.originalname}`;
        const params: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        img_name = req.file.originalname;
        const command = new PutObjectCommand(params);
        await s3.send(command);
      }
        const insertMarket = await sql`
            INSERT INTO custom_market(user_uuid, name, startdate, enddate, img_name)
            VALUES (${user_uuid}, ${name}, ${startdate}, ${enddate}, ${img_name})
            RETURNING *
        `;
        return res.status(201).json({
          message: "successfully uploaded image to s3 and updated record",
          insertMarket,
        });
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

app.post("/api/custom_booth/:user_uuid", async (req, res) => {
  const { user_uuid } = req.params;
  const { boothName, boothNumber, location, market_uuid } = req.body;

  console.log(
    "app.post custom_booth/user_uuid: req.body: ",
    JSON.stringify(req.body)
  );

  // <missing> check if market exists before adding booth using user_uuid

  try {
    const insertBooth = await sql`
            INSERT INTO custom_booth(name, number, market_uuid, latitude, longitude)
            VALUES (${boothName}, ${boothNumber}, ${market_uuid}, ${location?.lat}, ${location?.lng})
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

app.patch("/api/custom_booth/:booth_uuid", async (req, res) => {
  const { booth_uuid } = req.params;
  const updates = req.body as Partial<CustomBooth>;

  console.log("app.patch custom_booth updates: ", updates);
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "no fields to update" });
  }

  //check if booth exists under market
  const existing =
    await sql`SELECT * FROM custom_booth WHERE uuid = ${booth_uuid}`;
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
    WHERE uuid = ${booth_uuid}
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
  "/api/custom_market/:market_uuid/:user_uuid",
  upload.single("image"),
  async (req, res) => {
    const { market_uuid, user_uuid } = req.params;
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

    console.log("app.patch/custom_market values to patch: ", updates)
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
        const key = `user-uploads/${user_uuid}/markets/${req.file.originalname}`;
        const params: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        // setClauses.push(`img_name=$${i}`)
        // values.push(req.file.originalname)
        //  i++;
        const command = new PutObjectCommand(params);
        await s3.send(command);
      }

      const query = `
    UPDATE custom_market
    SET ${setClauses.join(", ")}
    WHERE uuid = '${market_uuid}' AND user_uuid = '${user_uuid}'
    RETURNING *;
  `;

      console.log("app.patch: update query: ", query);
      console.log("app.patch: update values: ", values);

      const updatedMarket = await sql.query(query, values);
      return res.status(200).json({
        message: "app.patch: Market updated successfully",
        updatedMarket: updatedMarket,
      });
    } catch (err: any) {
  console.error(err);
  res.status(500).json({ error: err.message });
    }
  }
);

app.get("/", (req, res) => {
  res.send("It's working");
});

app.listen(PORT, () => {
  console.log("Server is up and running on PORT: ", PORT);
});
