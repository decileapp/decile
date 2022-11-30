import { User } from "@supabase/supabase-js";
import { Database } from "../../types/database.types";
import { getServiceSupabase, supabase } from "../supabaseClient";

const serviceSupabase = getServiceSupabase();

type ResponseType = Database["public"]["Tables"]["org_users"]["Row"] & {
  org: {
    id: string;
    name: string;
    plan_id: number;
  };
};

// Set cookies
const updateOrgForSession = async (user: User) => {
  // Get org id
  const { data: rawData, error } = await serviceSupabase
    .from("org_users")
    .select("*, org:org_id(id, name, plan_id)")
    .match({ user_id: user?.id })
    .single();
  const data: ResponseType = rawData;
  // If no data check if user has been invited
  if (!data) {
    const { data: invited, error } = await serviceSupabase
      .from("org_invitations")
      .select("id, org_id, role_id")
      .match({ invited_email: user?.email })
      .single();
    // If invited
    if (invited) {
      const { data: org, data: orgError } = await serviceSupabase
        .from("org_users")
        .insert({
          org_id: invited.org_id,
          user_id: user.id,
          role_id: invited.role_id,
        })
        .select("*")
        .single();
      if (org) {
        const { data: updated, error } = await serviceSupabase
          .from("org_invitations")
          .delete()
          .match({ invited_email: user?.email, org_id: invited.org_id })
          .select("id")
          .single();
        // Get org id
        const { data: rawFetchOrg, error: updateOrgError } =
          await serviceSupabase
            .from("org_users")
            .select("*, org:org_id(id, name, plan_id)")
            .match({ user_id: user?.id })
            .single();
        const fetchOrg: ResponseType = rawFetchOrg;

        const finalData = {
          org_id: fetchOrg.org.id,
          org_name: fetchOrg.org.name,
          plan_id: fetchOrg.org.plan_id,
          role_id: fetchOrg.role_id,
        };

        await serviceSupabase.auth.admin.updateUserById(fetchOrg.user_id, {
          user_metadata: finalData,
        });
        return finalData;
      }
      return undefined;
    }
    return undefined;
  }

  const finalData = {
    org_id: data.org.id,
    org_name: data.org.name,
    plan_id: data.org.plan_id,
    role_id: data.role_id,
  };
  const check = await serviceSupabase.auth.admin.updateUserById(data.user_id, {
    user_metadata: finalData,
  });
  return finalData;
};

export default updateOrgForSession;
