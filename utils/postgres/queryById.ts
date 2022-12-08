import { Pool } from "pg";
import { QueryWithDatabase } from "../../types/Query";
import { decrypt } from "../encryption";
import { getServiceSupabase, supabase } from "../supabaseClient";

const queryById = async ({
  userId,
  orgId,
  queryId,
}: {
  userId: string;
  orgId: string;
  queryId: string;
}) => {
  try {
    // Get body
    const serviceSupabase = getServiceSupabase();
    const { data, error } = await serviceSupabase
      .from("queries")
      .select("database(*), *")
      .match({ id: queryId })
      .single();

    if (!data) {
      throw Error("Query not found");
    }

    if (
      data.user_id === userId ||
      (data.org_id === orgId && data.public_query)
    ) {
      const formattedData = {
        user: data.database.dbUser,
        host: data.database.host,
        database: data.database.database,
        password: decrypt(data.database.password),
        port: data.database.port,
        ssl: data.database.ssl,
      };

      const pool = new Pool(formattedData);

      const result = await pool.query(data.body);
      return result;
    }
    return;
  } catch (e: any) {
    return e.hint;
  }
};

export default queryById;
