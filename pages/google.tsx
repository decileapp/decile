import { GetServerSideProps } from "next";
import Page from "../components/layouts/Page";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import GoogleImage from "../public/google.svg";
import Image from "next/image";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const Google: React.FC = () => {
  const [setup, setSetup] = useState(false);
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const authoriseGoogle = async () => {
    try {
      const res = await axios.get("/api/user/google");
      // If not authenticated open new tab for auth
      if (res.data.link) {
        window.open(res.data.link);
        setLoading(false);
        return;
      } else {
        setSetup(true);
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");
      setLoading(false);
      return;
    }
  };

  const checkGoogleAuth = async () => {
    try {
      const { data, error } = await supabase
        .from("integration_credentials")
        .select("id")
        .match({ user_id: user?.id })
        .single();
      // If not authenticated open new tab for auth
      if (data) {
        setLoading(false);
        setSetup(true);
        return;
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    checkGoogleAuth();
  }, []);

  return (
    <Page>
      <div className="flex flex-col justify-center items-center h-full w-full space-y-12 ">
        {setup && (
          <div className="flex flex-col justify-center items-center space-y-4">
            <p className="text-2xl">You're all set with Google Sheets.</p>
            <p>
              Export your first{" "}
              <a className="text-primary-500" href="/queries">
                query.
              </a>
            </p>
          </div>
        )}
        {!setup && (
          <div className="flex flex-col justify-center items-center space-y-4">
            <p className="text-2xl">Let's get you set up with Google Sheets.</p>
            <a
              href="#"
              className={`flex items-center justify-center space-x-2 rounded-md border border-gray-300  py-1 px-2 text-sm font-medium text-zinc-500 hover:bg-gray-50 bg-white shadow-md`}
              onClick={() => authoriseGoogle()}
            >
              <Image
                alt="Mountains"
                src={GoogleImage}
                layout="intrinsic"
                quality={100}
                height="30"
                width="30"
              />
              <p className="font-roboto text-md ">Connect Google Sheets</p>
            </a>
          </div>
        )}
      </div>
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

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default Google;
