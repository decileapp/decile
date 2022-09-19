import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import QueryForm from "../../components/forms/query";
import { Source } from "../../types/Sources";
import { getSupabase } from "../../utils/supabaseClient";

interface Props {
  sources: Source[];
}

const NewSource: React.FC<Props> = (props) => {
  return <QueryForm sources={props.sources} />;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const data = await getSession(req, res);

    const supabase = getSupabase(data?.accessToken);

    const { data: sources, error } = await supabase
      .from<Source[]>("sources")
      .select("id, name, host, database, port, dbUser, password, created_at");

    return {
      props: { sources: sources },
    };
  },
});

export default NewSource;
