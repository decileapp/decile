import type { NextApiRequest, NextApiResponse } from "next";
import emailHelper from "../../../../utils/emailHelper";
import { getServiceSupabase, supabase } from "../../../../utils/supabaseClient";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { email, admin, link, role_id } = req.body;

      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      if (!user || !token) {
        res.status(401).json({ error: "Not authorised" });
        return;
      }
      supabase.auth.setAuth(token);

      // Add the invite to DB
      const { data, error } = await supabase.from("org_invitations").insert({
        org_id: user.user_metadata.org_id,
        user_id: user.id,
        role_id: role_id,
        invited_email: email,
        status: "invited",
      });

      if (!data) {
        throw new Error("Something went wrong!");
      }

      const send = await emailHelper({
        from: process.env.FROM_EMAIL || "",
        to: email,
        templateId: "Z6V0E3HEAHM63SKRA3B05RKVR9AE",
        vars: {
          user: "User",
          admin: admin,
          link: link,
        },
      });
      res.status(200).json({});
      return;
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  }

  // GET ALL LINKS
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default handle;
