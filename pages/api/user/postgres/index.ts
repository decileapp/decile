import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
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
      const result = await pool.query(body);
      return res.status(200).json({ rows: result.rows, fields: result.fields });
    } catch (e: any) {
      if (e.hint) {
        res.status(200).json({ error: e.hint });
        return;
      }
      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export const config = {
  api: {
    responseLimit: "8mb",
  },
};

export default protectServerRoute(handle);
