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
import DatabaseSelector from "../components/query/common/DatabaseSelector";
import { selectedSourceState } from "../utils/contexts/query/state";
import { useRecoilState } from "recoil";

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
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);

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
        <div className="flex flex-col justify-center items-center h-full w-full ">
          {/* <div className="grid grid-cols-1 gap-12"> */}
          <div className="w-full sm:w-1/3 space-y-12">
            <DatabaseSelector
              sources={sources}
              changeDatabase={setSelectedSource}
            />
          </div>
          {/* </div> */}
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

  // Not handling auth on server side because auth token needs to be set
  if (sources && sources?.length > 0) {
    return {
      redirect: {
        destination: `/queries`,
        permanent: false,
      },
    };
  }

  // Not handling auth on server side because auth token needs to be set
  return {
    redirect: {
      destination: `/sources`,
      permanent: false,
    },
  };
};

export default Home;
