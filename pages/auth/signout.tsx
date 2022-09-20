import type { NextPage } from "next";
import { useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import Loading from "../../components/individual/Loading";

const Logout: NextPage = () => {
  const signout = async () => {
    await supabase.auth.signOut();
    return;
  };

  useEffect(() => {
    signout();
  }, []);

  return <Loading />;
};

export default Logout;
