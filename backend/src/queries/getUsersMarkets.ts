import { sql } from "../config/db.ts";

export async function getUserMarkets(userID:string): Promise<Record<string, any>[]|any> {
    var getMarkets: Record<string, any>[]
    try {
        getMarkets = await sql`
        SELECT * FROM marketEvent WHERE id = ${userID} ORDER BY startDate DESC`;
    console.log(`markets createed by user id ${userID}: `, getMarkets);
    } catch (error) {
          console.log("error getting market events", error);
          return error; 
    }
    return Promise.resolve(getMarkets)
}