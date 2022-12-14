import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import queryString from "querystring";
import { GetServerSideProps } from "next";
import Page from "../components/layouts/Page";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import Tooltip from "../components/individual/Tooltip";

interface Props {
  queries: number;
  sources: number;
  schedule: number;
  charts: number;
}

const Home: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }

    // Detect auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        supabase.auth.signOut();
        router.push({
          pathname: "/auth/reset",
          query: queryString.parse(router.asPath.split("#")[1]),
        });
        return;
      }

      return;
    });
    setLoading(false);
    return;
  }, [user?.id]);

  const onboardingBox = ({
    title,
    description,
    status,
    link,
    helperText,
  }: {
    title: string;
    description: string;
    status: boolean;
    link: string;
    helperText: string;
  }) => {
    return (
      <a
        className="flex flex-col h-full p-4 border rounded-lg bg-white dark:bg-zinc-700 space-y-4 shadow hover:shadow-xl transition duration-100 ease-in-out"
        href={link}
      >
        <div className="flex flex-row justify-between items-start">
          <p className="font-bold">{title}</p>
          <Tooltip helperText={helperText} position="top">
            {status ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <QuestionMarkCircleIcon className="h-5 w-5 text-secondary-500" />
            )}
          </Tooltip>
        </div>

        <p className="text-sm">{description}</p>
      </a>
    );
  };

  const metadata = [
    {
      title: "Learn",
      description: "Learn the basics of SQL to get started with Decile.",
      status: props.queries > 0,
      link: "/learn",
      helperText: "Save your first query to complete this step.",
    },
    {
      title: "Sources",
      description:
        "Connect your Postgres databases here to start querying them.",
      status: props.sources > 0,
      link: "/sources",
      helperText: "Connect a Postgres database to complete this step.",
    },
    {
      title: "Queries",
      description:
        "All your saved queries appear here. Write queries using SQL, AI or our query builder.",
      status: props.queries > 0,
      link: "/queries",
      helperText: "Save your first query to complete this step.",
    },
    {
      title: "Charts",
      description: "Any visualisation of your queries are saved here.",
      status: props.charts > 0,
      link: "/charts",
      helperText: "Save your first chart to complete this step.",
    },
    {
      title: "Schedule",
      description: "Any scheduled queries are displayed on this tab.",
      status: props.schedule > 0,
      link: "/schedule",
      helperText: "Schedule a query to complete this step.",
    },
  ];

  return (
    <Page title="Welcome">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col h-full w-full space-y-8 ">
          <p className="text-sm">
            Get started using the steps below, or read our{" "}
            <a className="text-primary-500" href={"/onboard"}>
              onboarding guide
            </a>
            .
          </p>
          <div className="grid grid-cols-2 gap-8">
            {metadata.map((m, id) => {
              return (
                <div className="col-span-1 flex flex-col h-32" key={id}>
                  {onboardingBox({ ...m })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const { data: sources, error: sourceError } = await supabase
    .from("sources")
    .select("id");

  const { data: queries, error: queryError } = await supabase
    .from("queries")
    .select("id")
    .match({ org_id: session.user.user_metadata.org_id });

  const { data: schedule, error: scheduleError } = await supabase
    .from("schedule")
    .select("id")
    .match({ org_id: session.user.user_metadata.org_id });

  const { data: charts, error: chartError } = await supabase
    .from("chart")
    .select("id")
    .match({ org_id: session.user.user_metadata.org_id });

  return {
    props: {
      queries: queries ? queries.length : 0,
      sources: sources ? sources.length : 0,
      charts: charts ? charts.length : 0,
      schedule: schedule ? schedule.length : 0,
    },
  };
};

export default Home;
