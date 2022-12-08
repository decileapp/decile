import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import queryString from "querystring";
import { GetServerSideProps } from "next";
import { BasicQuery } from "../types/Query";
import { Source } from "../types/Sources";
import { Schedule } from "../types/Schedule";
import Page from "../components/layouts/Page";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import sources from "./api/admin/sources";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import { postsState } from "../utils/contexts/posts/state";
import { selectedSourceState } from "../utils/contexts/query/state";

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
  }: {
    title: string;
    description: string;
    status: boolean;
    link: string;
  }) => {
    return (
      <a
        className="flex flex-col h-full p-4 border rounded-lg bg-white dark:bg-zinc-700 space-y-4 shadow hover:shadow-xl transition duration-100 ease-in-out"
        href={link}
      >
        <div className="flex flex-row justify-between items-start">
          <p className="font-bold">{title}</p>
          <div className="flex flex-row justify-between items-start">
            {status ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <QuestionMarkCircleIcon className="h-5 w-5 text-secondary-500" />
            )}
          </div>
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
    },
    {
      title: "Sources",
      description:
        "Connect your Postgres databases here to start querying them.",
      status: props.sources > 0,
      link: "/sources",
    },
    {
      title: "Queries",
      description:
        "All your saved queries appear here. Write queries using SQL, AI or our query builder.",
      status: props.queries > 0,
      link: "/queries",
    },
    {
      title: "Charts",
      description: "Any visualisation of your queries are saved here.",
      status: props.charts > 0,
      link: "/charts",
    },
    {
      title: "Schedule",
      description: "Any scheduled queries are displayed on this tab.",
      status: props.schedule > 0,
      link: "/schedule",
    },
  ];

  return (
    <Page title="Welcome" description="Get started using the steps below.">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col h-full w-full space-y-8 justify-between pb-10">
          <div className="grid grid-cols-2 gap-8">
            {metadata.map((m, id) => {
              return (
                <div className="col-span-1 flex flex-col h-32" key={id}>
                  {onboardingBox({ ...m })}
                </div>
              );
            })}
          </div>
          <p className="text-sm">
            To get yourself set up with Decile, please review{" "}
            <a
              className="text-primary-500"
              href={process.env.NEXT_PUBLIC_ONBOARDING_GUIDE}
            >
              this
            </a>{" "}
            guide or{" "}
            <a className="text-primary-500" href={`mailto:support@decile.app`}>
              email us
            </a>
            .
          </p>
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
