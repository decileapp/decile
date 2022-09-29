import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../utils/encryption";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { body, dbUser, host, database, password, port, ssl } = req.body;
      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: decrypt(password),
        port: port,
        ssl: ssl,
      });

      try {
        const result = await pool.query(body);
        return res.status(200).json({ result: result });
      } catch (e: any) {
        return res.status(200).json({ error: e.hint });
      }
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  }

  // GET ALL LINKS
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
