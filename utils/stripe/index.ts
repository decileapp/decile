import { getServiceSupabase } from "../supabaseClient";

const serviceSupabase = getServiceSupabase();

export const updateToPaidPlan = async ({
  stripePriceId,
  stripeCustomerId,
}: {
  stripePriceId: string;
  stripeCustomerId: string;
}) => {
  // Update the plan for the organisation
  const { data: findPlan, error } = await serviceSupabase
    .from("plan")
    .select("id")
    .match({ stripe_price_id: stripePriceId })
    .single();

  if (findPlan) {
    const { data, error } = await serviceSupabase
      .from("organisations")
      .update({ plan_id: findPlan.id })
      .match({ stripe_customer_id: stripeCustomerId })
      .select("*")
      .single();

    if (data) {
      await updatePlanForAllUsers(data.id, findPlan.id);
    }

    return;
  } else {
    throw new Error("Plan not found");
  }
};

export const downgradeToFree = async (stripeCustomerId: string) => {
  const { data, error } = await serviceSupabase
    .from("organisations")
    .update({ plan_id: 1 })
    .match({ stripe_customer_id: stripeCustomerId })
    .select("id")
    .single();

  if (data) {
    await updatePlanForAllUsers(data.id, 1);
  }
  return;
};

const updatePlanForAllUsers = async (orgId: string, planId: number) => {
  try {
    // Get all users
    const { data: orgUsers, error } = await serviceSupabase
      .from("org_users")
      .select("*, org:org_id(name)")
      .match({ org_id: orgId });

    if (orgUsers && orgUsers?.length > 0) {
      // Update all users
      const updateUsers = orgUsers.map(async (o) => {
        const { data, error } = await serviceSupabase.auth.admin.updateUserById(
          o.user_id,
          {
            user_metadata: {
              org_id: o.org.id,
              org_name: o.org.name,
              plan_id: planId,
              role_id: o.role_id,
            },
          }
        );
      });

      const complete = await Promise.all(updateUsers);
    }
    return;
  } catch (e) {
    throw Error("Failed to update users.");
  }
};
