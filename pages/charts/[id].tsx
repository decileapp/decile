import { useEffect, useState } from "react";
import Loading from "../../components/individual/Loading";
import { GetServerSideProps } from "next";
import { dataState, fieldsState } from "../../utils/contexts/query/state";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";
import { Chart } from "../../types/Chart";
import ChartContainer from "../../components/graphs/common/ChartContainer";
import Page from "../../components/layouts/Page";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  chart: Chart;
}

const ViewChart: React.FC<Props> = (props) => {
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
      console.error(e);
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

  const { data: chart, error } = await supabase
    .from("chart")
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
