import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Query } from "../../../types/Query";
import Loading from "../../../components/individual/Loading";
import { Source } from "../../../types/Sources";
import { GetServerSideProps } from "next";
import {
  bodyState,
  columnsState,
  nameState,
  publicQueryState,
  queryFilterState,
  queryGroupByState,
  queryIdState,
  queryLimitState,
  querySortByState,
  queryUpdatedAtState,
  queryVarsState,
  selectedSourceState,
  selectedTableState,
  sourceSchemaState,
  tablesState,
  dataState,
  fieldsState,
  queryTypeState,
} from "../../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import QueryView from "../../../components/query/view";
import axios from "axios";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  sources: Source[];
  query: Query;
}

const EditQuery: React.FC<Props> = (props) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const { query, sources } = props;

  // Query
  const [queryId, setQueryId] = useRecoilState(queryIdState);
  const [name, setName] = useRecoilState(nameState);
  const [body, setBody] = useRecoilState(bodyState);
  const [publicQuery, setPublicQuery] = useRecoilState(publicQueryState);

  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const setSelectedSchema = useSetRecoilState(sourceSchemaState);

  // // Tables
  const setTables = useSetRecoilState(tablesState);
  const setSelectedTable = useSetRecoilState(selectedTableState);

  // // Columns
  const setColumns = useSetRecoilState(columnsState);

  // // Query
  const setSavedAt = useSetRecoilState(queryUpdatedAtState);
  const setQueryVars = useSetRecoilState(queryVarsState);
  const setQueryFilterBy = useSetRecoilState(queryFilterState);
  const setQueryGroupBy = useSetRecoilState(queryGroupByState);
  const setQuerySortBy = useSetRecoilState(querySortByState);
  const setQueryLimit = useSetRecoilState(queryLimitState);
  const setQueryType = useSetRecoilState(queryTypeState);

  const setData = useSetRecoilState(dataState);
  const setFields = useSetRecoilState(fieldsState);

  // Query
  const queryDb = async () => {
    setLoading(true);

    if (!props.sources) {
      setLoading(false);
      return;
    }

    if (props.sources.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const selectedDb = sources.find((s) => s.id === query.database);
      // Query details
      if (query.database) {
        setSelectedSource(query.database);
      }
      if (query.updated_at) {
        setSavedAt(query.updated_at);
      }
      if (query.id) {
        setQueryId(query.id);
      }
      if (query.body) {
        setBody(query.body);
      }
      if (query.publicQuery) {
        setPublicQuery(query.publicQuery);
      }
      if (query.name) {
        setName(query.name);
      }

      if (query.query_vars && query.query_vars.length > 0) {
        setQueryVars(query.query_vars);
      }
      if (query.query_filter_by && query.query_filter_by.length > 0) {
        setQueryFilterBy(query.query_filter_by);
      }
      if (query.query_group_by && query.query_group_by.length > 0) {
        setQueryGroupBy(query.query_group_by);
      }
      if (query.query_sort_by && query.query_sort_by.length > 0) {
        setQuerySortBy(query.query_sort_by);
      }
      if (query.query_limit) {
        setQueryLimit(query.query_limit);
      }
      if (query.query_type) {
        setQueryType(query.query_type);
      }

      const res = await axios.post<{ rows: any[]; fields: any[]; error: any }>(
        "/api/user/postgres",
        {
          body: query.body,
          ...selectedDb,
        }
      );
      if (res.data.error) {
        toast.error("Something went wrong.");
        setLoading(false);
        return;
      }

      if (res.data.fields && res.data.rows) {
        const fields: string[] = res.data.fields.map((f: any) => f.name);
        const rows: {}[] = res.data.rows;
        setFields(fields);
        setData(rows);
      }
      setLoading(false);
      return;
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please check your query.");
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (query) {
      queryDb();
    }
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <QueryView sources={sources} owner={query.user_id.id === user?.id} />
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
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

  const { data: sources, error } = await supabase
    .from("sources")
    .select("*")
    .or(`org_id.eq.${session.user?.user_metadata.org_id}, public.is.true`);

  const { data: query, error: queryError } = await supabase
    .from("queries")
    .select(`*, user_id(id, email)`)
    .match({ id: ctx.query.id })
    .single();
  if (!query) {
    return {
      redirect: {
        destination: "/queries",
        permanent: false,
      },
    };
  }

  if (!query.database) {
    return {
      redirect: {
        destination: `/queries/edit/${query.id}`,
        permanent: false,
      },
    };
  }

  return {
    props: { sources: sources, query: query },
  };
};

export default EditQuery;
