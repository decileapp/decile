import { Pool } from "pg";
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
      .select(
        "id, database(dbUser, host, database, password, port, ssl), body, user_id, org_id"
      )
      .match({ id: parseInt(queryId, 10) })
      .single();
    if (
      data.user_id === userId ||
      (data.org_id === orgId && data.publicQuery)
    ) {
      // Decrypt
      let decryptedSetup = data.database;
      decryptedSetup.password = decrypt(data.database.password);

      const pool = new Pool(decryptedSetup);

      const result = await pool.query(data.body);
      return result;
    }
  } catch (e: any) {
    return e.hint;
  }
};

export default queryById;
