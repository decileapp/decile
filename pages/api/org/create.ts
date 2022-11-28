import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import protectServerRoute from "../../../utils/auth/protectServerRoute";
import updateOrgForSession from "../../../utils/organisation/updateOrgForSession";
import { supabase } from "../../../utils/supabaseClient";

// Adds org meta data to user object
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
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

      const { orgName } = req.body;
      if (!orgName) {
        res.status(400).json({ error: "No org name found." });
        return;
      }

      const stripe = new Stripe(process.env.STRIPE_KEY || "", {
        apiVersion: "2022-08-01",
      });

      // Create org
      const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .insert({
          name: orgName,
          user_id: user?.id,
          plan_id: 1, // free
        })
        .select("*")
        .single();

      // Create role
      if (orgData) {
        const { data: roleData, error: roleError } = await supabase
          .from("org_users")
          .insert({
            org_id: orgData.id,
            user_id: user?.id,
            role_id: 1, // admin
          })
          .select("*")
          .single();

        // Create stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: orgData.name,
          metadata: { orgId: orgData.id },
        });

        // Close dialog
        if (roleData && customer) {
          // Update org table with stripe customer
          const { data: updatedOrg, error: orgError } = await supabase
            .from("organisations")
            .update({
              stripe_customer_id: customer.id,
            })
            .match({ id: orgData.id })
            .select("id");

          const updatedOrgSession = await updateOrgForSession(user);

          if (updatedOrgSession) {
            res.status(200).json({ success: true });
            return;
          }
          res.status(200).json({ success: false });
        }
        // If it doesnt work delete org
        else {
          const { data: deleted, error } = await supabase
            .from("organisations")
            .delete()
            .match({ id: orgData.id });
          res.status(500).json({ error: "Something went wrong!" });
        }
      }
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to create stripe customer.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
