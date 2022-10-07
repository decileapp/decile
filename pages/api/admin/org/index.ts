import { NextApiRequest, NextApiResponse } from "next";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { getServiceSupabase } from "../../../../utils/supabaseClient";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { orgId, userId, roleId } = req.body;
      const supabase = getServiceSupabase();
      const { data: org, data: orgError } = await supabase
        .from("org_users")
        .insert({
          org_id: parseInt(orgId as string, 10),
          user_id: userId,
          role_id: parseInt(roleId as string, 10),
        });

      if (org) {
        res.status(200).json({ success: true });
        return;
      }
      res.status(400).json({ success: false });
      return;
    } catch (e) {
      console.log(e);
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
