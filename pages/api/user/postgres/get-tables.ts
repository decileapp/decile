import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { dbUser, host, database, password, port, ssl } = req.body;
      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: decrypt(password),
        port: port,
        ssl: ssl,
      });
      const tables = await pool.query(
        "SELECT * FROM information_schema.tables where table_schema = 'public'"
      );
      return res.status(200).json({
        tables: tables.rows.map((r) => {
          return { name: r.table_name, schema: r.table_schema };
        }),
      });
    } catch (e) {
      console.error(e);
      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
