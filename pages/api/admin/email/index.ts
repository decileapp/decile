import type { NextApiRequest, NextApiResponse } from "next";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import emailHelper from "../../../../utils/emailHelper";
import { supabase } from "../../../../utils/supabaseClient";

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

      // Check users and plans
      const { data: orgLimit, error: orgError } = await supabase
        .from("plan")
        .select("id, user_limit")
        .match({ id: user.user_metadata.plan_id })
        .single();

      const { data: orgUsers, error: orgUserError } = await supabase
        .from("org_users")
        .select("id")
        .match({ org_id: user.user_metadata.org_id });

      if (!orgUsers || !orgLimit) {
        throw new Error("Something went wrong");
        return;
      }
      if (orgUsers?.length > orgLimit.user_limit) {
        res
          .status(200)
          .json({ error: "Please upgrade your account to invite users." });
        return;
      }

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
        templateId: process.env.COURIER_INVITE_TEMPLATE || "",
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

export default protectServerRoute(handle);
