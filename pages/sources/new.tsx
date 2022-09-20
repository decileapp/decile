import { GetServerSideProps } from "next";
import SourceForm from "../../components/forms/source";
import { supabase } from "../../utils/supabaseClient";

const NewSource: React.FC = () => {
  return <SourceForm />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
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
