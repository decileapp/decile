import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import { event } from "../utils/mixpanel";
import { supabase } from "../utils/supabaseClient";
import queryString from "querystring";
import { GetServerSideProps } from "next";
import { Query } from "../types/Query";
import Search from "../components/individual/Search";

interface Props {
  queries: Query[];
}

const Home: React.FC<Props> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = supabase.auth.user();
  const { queries } = props;

  useEffect(() => {
    event("landing_page", {});

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
    <div className="flex flex-col flex-grow place-self-center h-full w-full space-y-16 md:space-y-24">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center items-center h-full w-full space-y-4 ">
          <p className="text-2xl">What data are you looking for?</p>
          {queries && queries.length > 0 && (
            <div className="flex w-full sm:w-1/3">
              <Search
                // title="What data are you looking for?"
                options={props.queries.map((s) => {
                  return { name: s.name, value: s.name };
                })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/auth/signin`,
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(token);

  const { data: queries, error } = await supabase
    .from<Query[]>("queries")
    .select("id, name, user_id(id, email)");
  console.log(queries);
  return {
    props: { queries: queries },
  };
};

export default Home;
