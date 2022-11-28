import QueryForm from "../../../components/query/form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { Query } from "../../../types/Query";
import Loading from "../../../components/individual/Loading";
import { Source } from "../../../types/Sources";
import { GetServerSideProps } from "next";
import { fetchTablesAndColumns } from "../../../components/query/functions";
import {
  bodyState,
  columnsState,
  nameState,
  publicQueryState,
  queryBuilderState,
  queryFilterState,
  queryGroupByState,
  queryIdState,
  queryLimitState,
  querySortByState,
  queryTypeState,
  queryUpdatedAtState,
  queryVarsState,
  selectedSourceState,
  selectedTableState,
  sourceSchemaState,
  tablesState,
} from "../../../utils/contexts/query/state";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";

interface Props {
  sources: Source[];
}

const NewQuery: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const { sources } = props;

  return loading ? <Loading /> : <QueryForm sources={sources} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);
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
    .from<Source>("sources")
    .select(
      "id, name, host, database, port, dbUser, password, ssl, created_at, user_id"
    );

  return {
    props: { sources: sources },
  };
};

export default NewQuery;
