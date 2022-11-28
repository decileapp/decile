import type { NextPage } from "next";
import { useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Loading from "../../components/individual/Loading";
import { useRouter } from "next/router";

const Logout: NextPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const signout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    return;
  };

  useEffect(() => {
    signout();
  }, []);

  return <Loading />;
};

export default Logout;
