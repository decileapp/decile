import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import queryById from "../../../../utils/postgres/queryById";
import { supabase } from "../../../../utils/supabaseClient";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      // Check user
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401);
      }
      const { user } = session;

      const { id } = req.query;

      if (!id) {
        throw Error("No query Id");
      }
      const result = await queryById({
        queryId: id.toString(),
        userId: user.id,
        orgId: user.user_metadata.org_id,
      });
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
