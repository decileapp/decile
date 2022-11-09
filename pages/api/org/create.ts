import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import protectServerRoute from "../../../utils/auth/protectServerRoute";
import updateOrgForSession from "../../../utils/organisation/updateOrgForSession";
import { supabase } from "../../../utils/supabaseClient";

// Adds org meta data to user object
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      if (!user || !token) {
        res.status(401).json({ error: "Not authorised" });
        return;
      }
      supabase.auth.setAuth(token);

      const { orgName } = req.body;
      if (!orgName) {
        res.status(400).json({ error: "No org name found." });
        return;
      }

      const stripe = new Stripe(process.env.STRIPE_KEY || "", {
        apiVersion: "2022-08-01",
      });

      // Check there is no org already
      // const { data: checkOrg } = await supabase
      //   .from("organisations")
      //   .select("id")
      //   .match({ user_id: user?.id })
      //   .single();
      // if (checkOrg) {
      //   res
      //     .status(400)
      //     .json({ error: "An organisation already exists for this user." });
      //   return;
      // }

      // Create org
      const { data, error: orgError } = await supabase
        .from("organisations")
        .insert({
          name: orgName,
          user_id: user?.id,
          plan_id: 1, // free
        })
        .single();

      // Create role
      if (data) {
        const { data: roleData, error: roleError } = await supabase
          .from("org_users")
          .insert({
            org_id: data.id,
            user_id: user?.id,
            role_id: 1, // admin
          })
          .single();

        // Create stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: data.name,
          metadata: { orgId: data.id },
        });

        // Close dialog
        if (roleData && customer) {
          // Update org table with stripe customer
          const { data: updatedOrg, error: orgError } = await supabase
            .from("organisations")
            .update({
              stripe_customer_id: customer.id,
            })
            .match({ id: data.id });

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
            .match({ id: data.id });
        }
      }
    } catch (e) {
      console.log(e);
      throw new Error(`Failed to create stripe customer.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
