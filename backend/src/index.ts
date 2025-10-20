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

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

dotenv.config();
const app = express();

// middleware
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

app.get("/api/marketEvent/:userID", async (req, res) => {
  const { userID } = req.params;
  console.log("getting markets");
  try {
    console.log(userID);
    const getMarkets = await sql`
        SELECT * FROM marketEvent WHERE user_id = ${userID} ORDER BY startDate DESC`;
    console.log(`markets created by user id ${userID}: `, getMarkets);

    for(const market of getMarkets) {
        const key = `user-uploads/${userID}/${market.img_name}`
        const getObjectParams = {
            Bucket: bucketName, 
            Key: key
        }
        const command = new GetObjectCommand(getObjectParams); 
        const url = await getSignedUrl(s3, command, {expiresIn: 3600} )
        market.img_url = url;
    }
    return res.status(200).json({
      message: "Successfully fetched markets",
      markets: getMarkets,
    });
  } catch (error) {
    console.log("error getting market event", error);
    res.status(500).json({
      message: `Internal Server Error, could not fetch market event made by user: ${userID}`,
    });
  }
});

app.post(
  "/api/marketEvent/:userID",
  upload.single("image"),
  async (req, res) => {
    const { userID } = req.params;
    console.log("req body for post: ", req.body)
    const { marketName, startDate, endDate, img_uri } = req.body;
    const key = `user-uploads/${userID}/${req.file?.originalname}`;

    console.log("req file: ", req.file)
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
            INSERT INTO marketEvent(user_id, name, startDate, endDate, img_name, img_url)
            VALUES (${userID}, ${marketName}, ${startDate}, ${endDate}, ${req.file.originalname}, ${img_uri})
            RETURNING *
        `;
        return res
          .status(201)
          .json({
            message: "successfully uploaded image to s3 and updated record",
            insertMarket,
          });
      }
    } catch (error) {
      console.error(
        "Error getting image to post to S3 and/or inserting into table: ",
        error
      );
      return res
        .status(500)
        .json({
          msesage: "internal error, issue posting to s3 and updating table",
        });
    }
  }
);

app.get("/", (req, res) => {
  res.send("It's working");
});

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS marketEvent(
        UUID SERIAL PRIMARY KEY,
        user_id INT NOT NULL, 
        name VARCHAR(255) NOT NULL, 
        startDate DATE NOT NULL,
        endDate DATE NOT NULL, 
        img_name VARCHAR(255),
        img_url VARCHAR(255)
        )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // statue code 1 means failure, 0 sucess
  }
}

initDB().then(() => {
  console.log("my port: ", PORT);
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT: ", PORT);
  });
});
