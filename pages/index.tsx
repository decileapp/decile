import { useRouter } from "next/router";
import { useEffect, Fragment, useState } from "react";
import Loading from "../components/individual/Loading";
import { event } from "../utils/mixpanel";
import Hero from "../components/landing/Hero";
import LandingFooter from "../components/landing/LandingFooter";
import { useUser } from "@auth0/nextjs-auth0";

const Home: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const user = supabase.auth.user();
  const { handleText } = router.query;
  const { user, error: userError, isLoading } = useUser();

  console.log(user);

  useEffect(() => {
    setLoading(true);
    event("landing_page", {});

    setLoading(false);
  }, [user]);

  return (
    <div className="flex flex-col flex-grow place-self-center h-full w-full space-y-16 md:space-y-24">
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="flex flex-col place-self-center h-full w-full lg:w-2/3 xl:w-1/2 space-y-16 md:space-y-24">
            <Hero handleText={handleText?.toString()} />
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
