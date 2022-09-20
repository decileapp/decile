import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import { event } from "../utils/mixpanel";
import Hero from "../components/landing/Hero";
import LandingFooter from "../components/landing/LandingFooter";
import { supabase } from "../utils/supabaseClient";
import queryString from "querystring";

const Home: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();

  useEffect(() => {
    // setLoading(true);
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
      // setLoading(false);
      return;
    });

    if (!user) {
      router.push("/auth/signin");
    }

    if (user) {
      router.push("/queries");
      return;
    }

    // setLoading(false);
    return;
  }, [user?.id]);
  return (
    <div className="flex flex-col flex-grow place-self-center h-full w-full space-y-16 md:space-y-24">
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="flex flex-col place-self-center h-full w-full lg:w-2/3 xl:w-1/2 space-y-16 md:space-y-24">
            <Hero />
          </div>

          {/* <div className="flex flex-col items-center justify-center w-full space-y-4">
            <p className="text-center text-xl">Level up your creator game</p>
            <Button
              label="Sign up"
              onClick={() => router.push("/auth/signup")}
              type="primary"
            />
          </div> */}
          <LandingFooter />
        </Fragment>
      )}
    </div>
  );
};

export default Home;
