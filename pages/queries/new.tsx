import { GetServerSideProps } from "next";
import QueryForm from "../../components/forms/query";
import { Source } from "../../types/Sources";
import { supabase } from "../../utils/supabaseClient";

interface Props {
  sources: Source[];
}

const NewSource: React.FC<Props> = (props) => {
  return <QueryForm sources={props.sources} />;
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

  const { data: sources, error } = await supabase
    .from<Source[]>("sources")
    .select("id, name, host, database, port, dbUser, password, created_at");

  return {
    props: { sources: sources },
  };
};

export default NewSource;
