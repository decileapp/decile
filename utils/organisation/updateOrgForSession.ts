import { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

// Set cookies
const updateOrgForSession = async (user: User) => {
  // Get org id
  const { data, error } = await supabase
    .from("org_users")
    .select("id, org_id(id, name, plan_id), role_id")
    .match({ user_id: user?.id })
    .single();

  // If no data check if user has been invited
  if (!data) {
    const { data: invited, error } = await supabase
      .from("org_invitations")
      .select("id, org_id, role_id")
      .match({ invited_email: user?.email })
      .single();
    // If invited
    if (invited) {
      const { data: org, data: orgError } = await supabase
        .from("org_users")
        .insert({
          org_id: invited.org_id,
          user_id: user.id,
          role_id: invited.role_id,
        })
        .single();
      if (org) {
        const { data: updated, error } = await supabase
          .from("org_invitations")
          .update({ status: "signed up" })
          .match({ invited_email: user?.email, org_id: invited.org_id })
          .single();
        // Get org id
        const { data: fetchOrg, error: updateOrgError } = await supabase
          .from("org_users")
          .select("id, org_id(id, name, plan_id), role_id")
          .match({ user_id: user?.id })
          .single();

        await supabase.auth.update({
          data: {
            org_id: fetchOrg.org_id.id,
            org_name: fetchOrg.org_id.name,
            plan_id: fetchOrg.org_id.plan_id,
            role_id: fetchOrg.role_id,
          },
        });
        return fetchOrg;
      }
      return undefined;
    }
    return undefined;
  }

  await supabase.auth.update({
    data: {
      org_id: data.org_id.id,
      org_name: data.org_id.name,
      plan_id: data.org_id.plan_id,
      role_id: data.role_id,
    },
  });
  return data;
};

export default updateOrgForSession;
