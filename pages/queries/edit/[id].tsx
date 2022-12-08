import QueryForm from "../../../components/query/form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

interface Props {
  sources: Source[];
  query: Query;
}

const EditQuery: React.FC<Props> = (props) => {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const { query, sources } = props;

  const setSelectedSource = useSetRecoilState(selectedSourceState);
  const setSelectedSchema = useSetRecoilState(sourceSchemaState);

  // // Tables
  const setTables = useSetRecoilState(tablesState);
  const setSelectedTable = useSetRecoilState(selectedTableState);

  // // Columns
  const setColumns = useSetRecoilState(columnsState);

  // // Query
  const setQueryId = useSetRecoilState(queryIdState);
  const setName = useSetRecoilState(nameState);
  const setBody = useSetRecoilState(bodyState);
  const setPublicQuery = useSetRecoilState(publicQueryState);
  const setSavedAt = useSetRecoilState(queryUpdatedAtState);
  const setQueryVars = useSetRecoilState(queryVarsState);
  const setQueryFilterBy = useSetRecoilState(queryFilterState);
  const setQueryGroupBy = useSetRecoilState(queryGroupByState);
  const setQuerySortBy = useSetRecoilState(querySortByState);
  const setQueryLimit = useSetRecoilState(queryLimitState);
  const setQueryType = useSetRecoilState(queryTypeState);

  const initialLoad = async () => {
    setLoading(true);
    try {
      // Get tables and columns
      if (query.database) {
        setSelectedSource(query.database);
        const foundSource = sources.find((s) => s.id === query.database);
        if (foundSource) {
          const tablesAndColumns = await fetchTablesAndColumns(foundSource);

          if (tablesAndColumns) {
            setSelectedSchema(tablesAndColumns);
            const tables = tablesAndColumns.map((t) => {
              return { name: t.name, schema: t.schema };
            });
            setTables(tables);
            if (query.query_table) {
              const foundTable = tablesAndColumns.find(
                (t) => `${t.schema}.${t.name}` === query.query_table
              );
              if (foundTable) {
                const columns = foundTable.columns;
                setColumns(columns);
                setSelectedTable({
                  name: foundTable.name,
                  schema: foundTable.schema,
                });
              }
            }
          }
        }
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
      if (query.public_query) {
        setPublicQuery(query.public_query);
      }
      if (query.name) {
        setName(query.name);
      }

      if (query.query_vars) {
        setQueryVars(query.query_vars);
      }
      if (query.query_filter_by) {
        setQueryFilterBy(query.query_filter_by);
      }
      if (query.query_group_by) {
        setQueryGroupBy(query.query_group_by);
      }
      if (query.query_sort_by) {
        setQuerySortBy(query.query_sort_by);
      }
      if (query.query_limit) {
        setQueryLimit(query.query_limit);
      }
      if (query.query_type) {
        setQueryType(query.query_type);
      }

      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong.");
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  return loading ? <Loading /> : <QueryForm sources={sources} />;
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
    .or(`org_id.eq.${session.user?.user_metadata.org_id},public.eq.true`);

  const { data: query, error: queryError } = await supabase
    .from("queries")
    .select(
      `id, created_at, name, database, body, public_query, query_vars, query_group_by, query_filter_by, query_sort_by, query_limit, query_table, query_type, updated_at, user_id(id, email)`
    )
    .eq("id", ctx.query.id as string)
    .single();

  if (!query) {
    return {
      redirect: {
        destination: "/queries",
        permanent: false,
      },
    };
  }

  return {
    props: { sources: sources, query: query },
  };
};

export default EditQuery;
