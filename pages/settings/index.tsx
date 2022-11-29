import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../components/individual/Button";
import Page from "../../components/layouts/Page";
import Organisation from "../../components/team";
import Pricing from "../../components/pricing";
import { Org_User } from "../../types/Organisation";
import { classNames } from "../../utils/classnames";
import axios from "axios";
import { toast } from "react-toastify";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const tabs = [
  { name: "Organsation", href: "#" },
  { name: "Billing", href: "#" },
];

interface Props {
  members: Org_User[];
}

const Settings: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const router = useRouter();
  const user = useUser();
  const session = useSession();
  const [eligible, setEligible] = useState(false);
  const supabase = useSupabaseClient();

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: session?.refresh_token || "",
    });
    return;
  };

  const checkEligibility = async () => {
    setLoading(true);

    // Get latest plan info
    const res = await axios.get("/api/org");
    // Check users and plans
    const { data: orgLimit, error: orgError } = await supabase
      .from("plan")
      .select("id, user_limit")
      .match({ id: user?.user_metadata.plan_id })
      .single();
    const { data: orgUsers, error: orgUserError } = await supabase
      .from("org_users")
      .select("id")
      .match({ org_id: user?.user_metadata.org_id });
    if (!orgUsers || !orgLimit) {
      setLoading(false);
      toast.error("Something went wrong");
      return;
    }
    if (orgLimit.user_limit > orgUsers?.length) {
      setEligible(true);
    }
    setLoading(false);

    return;
  };

  const getPortalLink = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/billing/get-dashboard-link");
      if (res.data.link) {
        router.push(res.data.link);
      }
      setLoading(false);
      return;
    } catch (e) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    if (user) {
      checkEligibility();
    }
  }, [user]);

  // Only on first load
  useEffect(() => {
    if (user) {
      refreshSession();
    }
  }, []);

  return (
    <Page title="Settings" pageLoading={loading}>
      <div className="px-4 sm:px-6 md:px-0 h-full w-full">
        <div className="py-6">
          <div className="block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab, id) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      currentTab === id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                    )}
                    onClick={() => setCurrentTab(id)}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {currentTab === 0 && eligible && (
          <Organisation members={props.members} />
        )}
        {currentTab === 0 && !eligible && (
          <div className="space-y-4">
            <p>This plan does not allow you to invite team members.</p>
            <Button
              label="Upgrade"
              onClick={() => setCurrentTab(1)}
              type="primary"
            />
          </div>
        )}
        {currentTab === 1 && (
          <div className="flex flex-col h-full w-full  justify-start items-center pt-8">
            {user?.user_metadata.plan_id !== 1 && (
              <Button
                label="Portal"
                onClick={() => getPortalLink()}
                type="primary"
              />
            )}
            {user?.user_metadata.plan_id === 1 && (
              <Pricing showTrialExpiry={true} />
            )}
          </div>
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // Only show if assigned to org
  if (!session.user.user_metadata.org_id) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  const { data: members, error } = await supabase
    .from("org_users")
    .select(`id, org_id(id, name), role_id(id, name), user_id(id, email)`)
    .match({ org_id: session.user.user_metadata.org_id });

  return {
    props: { members: members },
  };
};

export default Settings;
