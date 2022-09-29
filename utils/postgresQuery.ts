import { Pool } from "pg";
import { decrypt } from "./encryption";

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
  // Decrypt
  let decryptedSetup = setup;
  decryptedSetup.password = decrypt(setup.password);

  const pool = new Pool(setup);

  try {
    const result = await pool.query(body);
    return result;
  } catch (e: any) {
    return e.hint;
  }
};

export default postgresQuery;
