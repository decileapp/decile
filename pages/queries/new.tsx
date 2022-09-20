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
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(token);

  const { data: sources, error } = await supabase
    .from<Source[]>("sources")
    .select(
      "id, name, host, database, port, dbUser, password, created_at, ssl"
    );

  return {
    props: { sources: sources },
  };
};

export default NewSource;
