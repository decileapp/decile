import { GetServerSideProps } from "next";
import SourceForm from "../../components/sources";
import { supabase } from "../../utils/supabaseClient";

const NewSource: React.FC = () => {
  return <SourceForm />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  // Admins only
  if (user.user_metadata.role_id !== 1) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default NewSource;
