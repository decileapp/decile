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
    <Page title="Welcome" description="Get started using the steps below.">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-start items-start h-full w-full space-y-12 mt-4">
          <div className="grid grid-cols-1 gap-12">
            <div className="flex flex-col justify-start">
              <a
                className="text-left text-lg font-bold mb-2 hover:text-primary-600"
                href="/sources"
              >
                Set up a data source
              </a>
              <p className="text-sm ">
                We support any Postgres database. Only admins can set up and
                manage data sources.
              </p>
            </div>
            <div className="flex flex-col justify-start">
              <a
                className="text-left text-lg font-bold mb-2 hover:text-primary-600"
                href="/queries"
              >
                Write your first query
              </a>
              <p className="text-sm ">
                Once you've set up your database, write your first query. You
                can use our online SQL editor or our query builder. Save queries
                and share across your team.
              </p>
            </div>
            <div className="flex flex-col justify-start">
              <a
                className="text-left text-lg font-bold mb-2 hover:text-primary-600"
                href="/schedule"
              >
                Schedule an export
              </a>
              <p className="text-sm ">
                Export the output of your data directly to Google Sheets. Once
                you've exported your data once, you can set up a schedule to
                have it automatically export.
              </p>
            </div>
            <div className="flex flex-col justify-start">
              <a
                className="text-left text-lg font-bold mb-2 hover:text-primary-600"
                href="/charts"
              >
                Graph your queries
              </a>
              <p className="text-sm ">
                Use our visualisation to graph your data and save your graphs.
              </p>
            </div>
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
    .from<Query[]>("queries")
    .select("id, name, user_id")
    .match({ org_id: user.user_metadata.org_id })
    .or(`user_id.eq.${user.id},publicQuery.is.true`);

  const { data: schedules, error: scheduleError } = await supabase
    .from<Schedule[]>("schedule")
    .select("id, name, user_id");

  return {
    props: { sources: sources, queries: queries, schedules: schedules },
  };
};

export default Home;
