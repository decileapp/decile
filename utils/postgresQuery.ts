import { Pool } from "pg";

interface Setup {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  ssl: boolean;
}

const postgresQuery = async ({
  setup,
  body,
}: {
  setup: Setup;
  body: string;
}) => {
  const pool = new Pool(setup);

  try {
    const result = await pool.query(body);
    return result;
  } catch (e: any) {
    return e.hint;
  }
};

export default postgresQuery;
