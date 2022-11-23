import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Query } from "../../types/Query";
import Loading from "../../components/individual/Loading";
import { Source } from "../../types/Sources";
import { GetServerSideProps } from "next";
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
  queryUpdatedAtState,
  queryVarsState,
  selectedSourceState,
  selectedTableState,
  sourceSchemaState,
  tablesState,
  dataState,
  fieldsState,
} from "../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import QueryView from "../../components/query/view";
import axios from "axios";
import { Chart } from "../../types/Chart";
import ChartContainer from "../../components/graphs/common/ChartContainer";
import Page from "../../components/layouts/Page";

interface Props {
  chart: Chart;
}

const ViewChart: React.FC<Props> = (props) => {
  const router = useRouter();
  const user = supabase.auth.user();
  const [loading, setLoading] = useState(false);
  const { chart } = props;

  const [data, setData] = useRecoilState(dataState);
  const [fields, setFields] = useRecoilState(fieldsState);

  // Query
  const queryDb = async () => {
    setLoading(true);

    try {
      const res = await axios.get<{ rows: any[]; fields: any[]; error: any }>(
        `/api/user/postgres/${chart.query_id.id}`
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
      console.log(e);
      toast.error("Something went wrong. Please check your query.");
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (chart) {
      queryDb();
    }
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Page title={chart.title}>
      {fields && data && (
        <ChartContainer
          fields={fields}
          data={data}
          chart={chart}
          queryId={chart.query_id.id}
        />
      )}
    </Page>
  );
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

  const { data: chart, error } = await supabase
    .from<Chart>("chart")
    .select(
      "id, title, chart_type, chart_meta_data, user_id(id, email), public_chart, query_id(id, name), org_id, created_at"
    )
    .eq("id", ctx.query.id as string)
    .single();

  if (!chart) {
    return {
      redirect: {
        destination: `/charts`,
        permanent: false,
      },
    };
  }

  return {
    props: { chart: chart },
  };
};

export default ViewChart;
