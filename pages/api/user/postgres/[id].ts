import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import queryById from "../../../../utils/postgres/queryById";
import { supabase } from "../../../../utils/supabaseClient";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      if (!user || !token) {
        return res.status(401);
      }

      supabase.auth.setAuth(token);
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
