import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../types/database.types";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import emailHelper from "../../../../utils/emailHelper";
import { getServiceSupabase } from "../../../../utils/supabaseClient";
type ResponseType = Database["public"]["Tables"]["org_users"]["Row"] & {
  org: {
    id: number;
    name: string;
    plan_id: number;
  };
};

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { email, admin, link, role_id } = req.body;
      // Check user
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401);
      }
      const { user } = session;

      // Check users and plans
      const { data: orgLimit, error: orgError } = await supabase
        .from("plan")
        .select("id, user_limit")
        .match({ id: user.user_metadata.plan_id })
        .single();

      const { data: rawFetchOrg, error: orgUserError } = await supabase
        .from("org_users")
        .select("*, org:org_id(id, name, plan_id)")
        .match({ org_id: user.user_metadata.org_id });

      if (!rawFetchOrg || rawFetchOrg?.length === 0 || !orgLimit) {
        throw new Error("Something went wrong");
      }
      if (rawFetchOrg.length > orgLimit.user_limit) {
        res
          .status(200)
          .json({ error: "Please upgrade your account to invite users." });
        return;
      }

      // Add the invite to DB
      const { data, error } = await supabase
        .from("org_invitations")
        .insert({
          org_id: user.user_metadata.org_id,
          user_id: user.id,
          role_id: role_id,
          invited_email: email,
          status: "invited",
        })
        .select("id");

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
      console.error(e);

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
