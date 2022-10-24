import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { Schema } from "../../../../types/Schema";

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

      // Get tables
      const rawTables = await pool.query(
        "SELECT * FROM information_schema.tables where table_schema = 'public'"
      );
      const tables = rawTables.rows;

      // Get columns
      const getColumns = async (table_schema: string, table_name: string) => {
        const columns = await pool.query(
          `SELECT *
                    FROM information_schema.columns
                   WHERE table_schema = '${table_schema}'
                     AND table_name   = '${table_name}'
                       ;`
        );
        return columns;
      };

      const schemaPromise = tables.map(async (t) => {
        const rawColumns = await getColumns(t.table_schema, t.table_name);
        const columns = rawColumns.rows.map((r) => {
          return {
            title: r.column_name,
            type: r.data_type,
          };
        });
        return {
          title: t.table_name,
          columns: columns,
        };
      });
      const schema: Schema[] = await Promise.all(schemaPromise);
      return res.status(200).json({ schema: schema });
    } catch (e) {
      console.log(e);
      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
