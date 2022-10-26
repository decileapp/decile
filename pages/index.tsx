import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import { supabase } from "../utils/supabaseClient";
import queryString from "querystring";
import { GetServerSideProps } from "next";
import { Query } from "../types/Query";
import { Source } from "../types/Sources";
import { Schedule } from "../types/Schedule";
import Page from "../components/layouts/Page";

interface Props {
  queries: Query[];
  sources: Source[];
  schedule: Schedule[];
}

const Home: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = supabase.auth.user();
  const { queries, sources, schedule } = props;

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

  return (
    <Page>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-start items-center h-full w-full space-y-12 p-4 mt-4">
          <p className="text-2xl font-semibold">Welcome!</p>
          <div className="flex flex-col justify-center align-center space-y-2">
            <p className="text-center text-lg">Get started in under 2 mins:</p>
            <p className="text-center">Set up a data source</p>
            <p className="text-center">Write your first query</p>
            <p className="text-center">Schedule an export to Google Sheets</p>
          </div>
          <div className="grid grid-cols-3 gap-12">
            <a
              className="grid-cols-1 px-12 py-8 bg-white border border-zinc-400 dark:bg-zinc-800 rounded-lg space-y-4"
              href="/sources"
            >
              <p className="text-primary-500 text-center text-xl font-semibold">
                Sources
              </p>
              <p className="text-center text-lg">
                {sources && sources.length > 0 ? sources.length : "No sources"}
              </p>
            </a>

            <a
              className="grid-cols-1 px-12 py-8 bg-white border border-zinc-400 dark:bg-zinc-800 rounded-lg space-y-4 "
              href="/queries"
            >
              <p className="text-primary-500 text-center text-xl font-semibold">
                Queries
              </p>
              <p className="text-center text-lg">
                {queries && queries.length > 0 ? queries.length : "No queries"}
              </p>
            </a>

            <a
              className="grid-cols-1 px-12 py-8 bg-white border border-zinc-400 dark:bg-zinc-800 rounded-lg space-y-4"
              href="/schedule"
            >
              <p className="text-primary-500 text-center text-xl font-semibold">
                Schedules
              </p>
              <p className="text-center text-lg">
                {schedule && schedule.length > 0
                  ? schedule.length
                  : "No schedules"}
              </p>
            </a>
          </div>
        </div>
      )}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);

  // Not handling auth on server side because auth token needs to be set
  if (!user || !token) {
    return { props: {} };
  }
  supabase.auth.setAuth(token);

  const { data: sources, error: sourceError } = await supabase
    .from<Source[]>("sources")
    .select("id, name, user_id");

  const { data: queries, error: queryError } = await supabase
    .from<Query[]>("sources")
    .select("id, name, user_id");

  const { data: schedules, error: scheduleError } = await supabase
    .from<Schedule[]>("schedule")
    .select("id, name, user_id");

  return {
    props: { sources: sources, queries: queries, schedules: schedules },
  };
};

export default Home;
