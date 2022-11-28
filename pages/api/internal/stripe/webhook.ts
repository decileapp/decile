import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { downgradeToFree, updateToPaidPlan } from "../../../../utils/stripe";
import { getServiceSupabase } from "../../../../utils/supabaseClient";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Relevant events
const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const serviceSupabase = getServiceSupabase();
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
      process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    const stripe = new Stripe(process.env.STRIPE_KEY || "", {
      apiVersion: "2022-08-01",
    });
    const signature = req.headers["stripe-signature"];
    const signingSecret = process.env.STRIPE_SIGNING_SECRET;

    try {
      if (!signature || !signingSecret) return;

      event = stripe.webhooks.constructEvent(buf, signature, signingSecret);

      if (relevantEvents.has(event.type)) {
        try {
          const subscription = event.data.object as Stripe.Subscription;

          switch (event.type) {
            // Handle changes
            case "customer.subscription.created":
            case "customer.subscription.updated":
              if (!subscription.items.data[0].plan.id || !subscription.customer)
                return;
              const updatedPlan = updateToPaidPlan({
                stripePriceId: subscription.items.data[0].price.id.toString(),
                stripeCustomerId: subscription.customer?.toString(),
              });

              break;
            case "customer.subscription.deleted":
              if (!subscription.customer) return;
              const cancelledPlan = downgradeToFree(
                subscription.customer?.toString()
              );
              break;

            // Handle new creations
            case "checkout.session.completed":
              const checkoutSession = event.data
                .object as Stripe.Checkout.Session;
              if (checkoutSession.mode === "subscription") {
                const subscriptionId = checkoutSession.subscription;

                if (!subscriptionId || !checkoutSession.customer) return;
                const subscription = await stripe.subscriptions.retrieve(
                  subscriptionId.toString(),
                  {
                    expand: ["default_payment_method"],
                  }
                );
                const updatedPlan = updateToPaidPlan({
                  stripePriceId: subscription.items.data[0].price.id.toString(),
                  stripeCustomerId: checkoutSession.customer?.toString(),
                });
              }
              break;
            default:
              throw new Error("Unhandled relevant event!");
          }
        } catch (e) {
          console.error(e);
          return res
            .status(400)
            .send('Webhook error: "Webhook handler failed. View logs."');
        }
      }

      res.json({ received: true });
      return;
    } catch (e) {
      return res.status(400).send(`Webhook signature failed`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handle;
