// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";
import "dotenv/config"

// creates a SQL connection using our DB URL
const db_url = process.env.DATABASE_URL ? process.env.DATABASE_URL : ""
export const sql = neon(db_url)