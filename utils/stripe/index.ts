import { getServiceSupabase } from "../supabaseClient";

const serviceSupabase = getServiceSupabase();

export const updateToPaidPlan = async ({
  stripeProductId,
  stripeCustomerId,
}: {
  stripeProductId: string;
  stripeCustomerId: string;
}) => {
  // Update the plan for the organisation
  const { data: findPlan, error } = await serviceSupabase
    .from("plan")
    .select("id")
    .match({ stripe_product_id: stripeProductId })
    .single();

  if (findPlan) {
    const { data, error } = await serviceSupabase
      .from("organisations")
      .update({ plan_id: findPlan.id })
      .match({ stripe_customer_id: stripeCustomerId });
    return;
  } else {
    throw new Error("Plan not found");
  }
};

export const downgradeToFree = async (stripeCustomerId: string) => {
  const { data, error } = await serviceSupabase
    .from("organisations")
    .update({ plan_id: 1 })
    .match({ stripe_customer_id: stripeCustomerId });
  return;
};
