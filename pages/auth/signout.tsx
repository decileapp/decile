import type { NextPage } from "next";
import { useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import Loading from "../../components/individual/Loading";
import { useRouter } from "next/router";

const Logout: NextPage = () => {
  const router = useRouter();
  const signout = async () => {
    await supabase.auth.signOut();
    await supabase.auth.api.signOut("");
    router.push("/");
    return;
  };

  useEffect(() => {
    signout();
  }, []);

  return <Loading />;
};

export default Logout;
