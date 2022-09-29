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

  await supabase.auth.update({
    data: {
      org_id: data.org_id.id,
      org_name: data.org_id.name,
      plan_id: data.org_id.plan_id,
      role_id: data.role_id,
    },
  });
  return;
};

export default updateOrgForSession;
