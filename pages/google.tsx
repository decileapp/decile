import { supabase } from "../utils/supabaseClient";
import { GetServerSideProps } from "next";
import Page from "../components/layouts/Page";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Button from "../components/individual/Button";

const Google: React.FC = () => {
  const [setup, setSetup] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    authoriseGoogle();
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
            <Button
              label="Setup google"
              onClick={() => authoriseGoogle()}
              type="primary"
            />
          </div>
        )}
      </div>
    </Page>
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

  return {
    props: {},
  };
};

export default Google;
