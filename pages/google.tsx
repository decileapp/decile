import { supabase } from "../utils/supabaseClient";
import { GetServerSideProps } from "next";
import Page from "../components/layouts/Page";

const Google: React.FC = () => {
  return (
    <Page>
      <div className="flex flex-col justify-center items-center h-full w-full space-y-12 ">
        <p className="text-2xl">Google is set up.</p>
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
