import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { supabase } from "../../../../utils/supabaseClient";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const stripe = new Stripe(process.env.STRIPE_KEY || "", {
        apiVersion: "2022-08-01",
      });

      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      if (!user || !token) {
        res.status(401).json({ error: "Not authorised" });
        return;
      }

      supabase.auth.setAuth(token);

      const { plan_type } = req.body;

      // Get stripe customer id
      const { data, error } = await supabase
        .from("organisations")
        .select("stripe_customer_id")
        .match({ id: user.user_metadata.org_id })
        .single();

      // If no org_id, reject
      if (!data || !plan_type) {
        res.status(400).json({ error: "No Stripe id found." });
        return;
      }

      let stripePriceId;
      // Get price id for stripe
      if (plan_type === "team") {
        stripePriceId = process.env.TEAM_PLAN;
      }

      if (plan_type === "enterprise") {
        stripePriceId = process.env.ENTERPRISE_PLAN;
      }

      if (!stripePriceId) {
        res.status(400).json({ error: "Price ID not found." });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_ORIGIN}`,
        cancel_url: `${process.env.NEXT_PUBLIC_ORIGIN}`,
        customer: data.stripe_customer_id,
      });
      if (!session.url) {
        throw new Error("Something went wrong");
      }
      return res.status(200).json({ link: session.url });
    } catch (e) {
      return res.status(400).send(`Webhook signature failed`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default protectServerRoute(handle);
