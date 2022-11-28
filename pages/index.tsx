import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import { supabase } from "../utils/supabaseClient";
import queryString from "querystring";
import { GetServerSideProps } from "next";
import { BasicQuery } from "../types/Query";
import { Source } from "../types/Sources";
import { Schedule } from "../types/Schedule";
import Page from "../components/layouts/Page";
import { useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  queries: BasicQuery[];
  sources: Source[];
  schedule: Schedule[];
}

const Home: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useUser();

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
        <div className="flex flex-col justify-center items-center h-full w-full "></div>
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
    .select("id, name, user_id");

  const { data: queries, error: queryError } = await supabase
    .from("queries")
    .select("id, name, user_id")
    .match({ org_id: session.user.user_metadata.org_id })
    .or(`user_id.eq.${session.user.id},publicQuery.is.true`);

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
