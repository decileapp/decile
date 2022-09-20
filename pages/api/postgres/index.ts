import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { body, dbUser, host, database, password, port, ssl, special } =
        req.body;

      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: special,
        port: port,
        ssl: ssl,
      });

      const tables = await pool.query(
        "SELECT * FROM information_schema.tables"
      );

      const result = await pool.query(body);

      // NEED TO SEND BACK ERRORS

      return res.status(200).json({ result: result });
    } catch (e) {
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
