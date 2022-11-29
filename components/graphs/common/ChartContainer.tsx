import { Serie } from "@nivo/line";
import { ReactElement, useState } from "react";
import Button from "../../individual/Button";
import MiniSelect from "../../individual/MiniSelect";
import Bar from "../bar";
import Line from "../line";
import Scatter from "../scatter";
import SaveChart from "./SaveNewChart";
import { Chart } from "../../../types/Chart";
import { toast } from "react-toastify";
import Loading from "../../individual/Loading";
import _ from "lodash";
import Switch from "../../individual/Switch";
import TextInput from "../../individual/TextInput";
import ChartView from "./ChartView";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

interface Props {
  fields: string[];
  data: any;
  chart?: Chart;
  queryId: number;
}

const ChartContainer: React.FC<Props> = (props) => {
  const { data, fields, chart, queryId } = props;
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  // Dialog
  const [open, setOpen] = useState(false);

  // Chart details
  const [chartId, setChartId] = useState<number | undefined>(chart?.id);
  const [title, setTitle] = useState<string | undefined>(chart?.title);
  const [publicChart, setPublicChart] = useState<boolean | undefined>(
    chart?.public_chart
  );

  // Chart controls
  const [xAxis, setXAxis] = useState<string>(
    chart?.chart_meta_data.xAxis || fields[0]
  );
  const [yAxis, setYAxis] = useState<string>(
    chart?.chart_meta_data.yAxis || fields[1]
  );
  const [chartType, setChartType] = useState<string>(
    chart?.chart_type || "line"
  );
  const [legend, setLegend] = useState<boolean>(
    chart?.chart_meta_data.legend || true
  );
  const [xAxisLabel, setXAxisLabel] = useState<string | undefined>(
    chart?.chart_meta_data.xAxisLabel
  );
  const [showXAxis, setshowXAxis] = useState(
    chart ? chart?.chart_meta_data.showXAxis : true
  );
  const [yAxisLabel, setYAxisLabel] = useState<string | undefined>(
    chart?.chart_meta_data.yAxisLabel
  );
  const [yAxisMin, setYAxisMin] = useState<number | undefined>(
    chart?.chart_meta_data.yAxisMin
  );
  const [yAxisMax, setYAxisMax] = useState<number | undefined>(
    chart?.chart_meta_data.yAxisMax
  );
  const [showYAxis, setshowYAxis] = useState(
    chart ? chart?.chart_meta_data.showYAxis : true
  );
  const [valueLabels, setValueLabels] = useState(
    chart ? chart?.chart_meta_data.valueLabels : true
  );

  const user = useUser();

  // xAxis
  const xOptions =
    fields && fields.length > 0
      ? fields.map((q: string, id: number) => {
          return {
            title: q,
            description: "",
            current: false,
            value: q,
          };
        })
      : [];

  // yAxis
  const yOptions =
    fields && fields.length > 0
      ? fields.map((q: string, id: number) => {
          return {
            title: q,
            description: "",
            current: false,
            value: q,
          };
        })
      : [];

  // Chart type
  let chartOptions = [
    {
      title: "Line",
      description: "",
      current: false,
      value: "line",
    },
    {
      title: "Bar",
      description: "",
      current: false,
      value: "bar",
    },
  ];

  // Add scatter only if both variables are numiercal
  if (
    typeof data[0][xAxis] === "number" &&
    typeof data[0][yAxis] === "number"
  ) {
    chartOptions.push({
      title: "Scatter",
      description: "",
      current: false,
      value: "scatter",
    });
  }

  let comp: ReactElement = (
    <p className="text-sm text-center">Please select an X and Y axis.</p>
  );

  // Handle bad data
  // Check yAxis is a number
  const isNumber = !isNaN(parseInt(data[0][yAxis], 10));
  const validGraph = isNumber && xAxis && yAxis;
  if (!validGraph) {
    if (!isNumber) {
      comp = (
        <p className="text-sm">Choose a numerical variable for the Y axis.</p>
      );
    }
  }

  if (chartType === "line" && validGraph) {
    const singleSeries = data.map((d: any) => {
      return { x: d[xAxis], y: d[yAxis] };
    });
    const formattedData: Serie[] = [{ id: "1", data: singleSeries }];
    comp = (
      <Line
        data={formattedData}
        xAxis={xAxis}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        yAxis={yAxis}
        legend={legend}
        valueLabels={valueLabels}
        showXAxis={showXAxis}
        showYAxis={showYAxis}
      />
    );
  }

  if (chartType === "scatter" && validGraph) {
    const singleSeries = data.map((d: any) => {
      return { x: d[xAxis], y: d[yAxis] };
    });
    const formattedData = [{ id: "1", data: singleSeries }];
    comp = <Scatter data={formattedData} />;
  }

  if (chartType === "bar" && validGraph) {
    const formattedData = data.map((d: any) => {
      return { x: d[xAxis], y: d[yAxis] };
    });
    comp = (
      <Bar
        data={data}
        xAxis={xAxis}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        yAxis={yAxis}
        legend={legend}
        valueLabels={valueLabels}
        showXAxis={showXAxis}
        showYAxis={showYAxis}
        yAxisMax={yAxisMax ? yAxisMax : undefined}
        yAxisMin={yAxisMin ? yAxisMin : undefined}
      />
    );
  }

  const chart_meta_data = {
    xAxis: xAxis,
    xAxisLabel: xAxisLabel,
    showXAxis: showXAxis,
    yAxis: yAxis,
    showYAxis: showYAxis,
    yAxisLabel: yAxisLabel,
    yAxisMin: yAxisMin,
    yAxisMax: yAxisMax,
    legend: legend,
    valueLabels: valueLabels,
  };

  const updateChart = async () => {
    try {
      if (!chart) {
        return;
      }

      const { data, error } = await supabase
        .from("chart")
        .update({
          title: title,
          user_id: user?.id,
          org_id: user?.user_metadata.org_id,
          chart_meta_data: chart_meta_data,
          chart_type: chartType,
          query_id: queryId,
          public_chart: publicChart,
        })
        .match({ id: props.chart?.id })
        .select("id");
      if (data) {
        toast.success("Chart updated!");
      }
      if (error) {
        toast.error("Something went wrong!");
      }
      setOpen(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");

      setOpen(false);
      return;
    }
  };

  const saveChart = async () => {
    try {
      if (!title) {
        toast.error("Please enter a name.");
      }

      if (!xAxis) {
        toast.error("No X Axis.");
      }

      if (!yAxis) {
        toast.error("No Y Axis.");
      }

      if (!chartType) {
        toast.error("No chart type.");
      }

      const { data, error } = await supabase
        .from("chart")
        .insert({
          title: title,
          user_id: user?.id,
          org_id: user?.user_metadata.org_id,
          chart_meta_data: chart_meta_data,
          chart_type: chartType,
          query_id: queryId,
          public_chart: publicChart,
        })
        .select("id");
      if (data) {
        toast.success("Chart saved!");
      }
      if (error) {
        toast.error("Something went wrong!");
      }
      setOpen(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");

      setOpen(false);
      return;
    }
  };

  const openSaveDialog = () => {
    if (!validGraph) {
      toast.error("Invalid graph.");
      return;
    }
    setOpen(true);
    return;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-9 w-full h-full">
      {queryId && (
        <SaveChart
          open={open}
          setOpen={setOpen}
          confirmFunc={saveChart}
          title={title}
          setTitle={setTitle}
          publicChart={publicChart}
          setPublicChart={setPublicChart}
        />
      )}
      <div className="col-span-2 flex flex-col justify-evenly items-start space-y-10 w-full h-full pr-2">
        <div className="flex flex-col space-y-2 justify-start items-start w-full">
          <div className="flex flex-row items-center justify-between space-x-2 border-b w-full pb-1">
            <MiniSelect
              title="Chart"
              options={chartOptions}
              setSelected={(x) => setChartType(x.value)}
              selected={chartOptions.find((x) => x.value === chartType)}
            />
          </div>

          <div className="flex flex-row space-x-2 justify-between items-center w-full">
            <p className="text-sm font-semibold text-zinc-600">Value labels</p>
            <Switch
              value={valueLabels}
              setSelected={() => setValueLabels(!valueLabels)}
            />
          </div>
          <div className="flex flex-row space-x-2 justify-between items-center w-full">
            <p className="text-sm font-semibold text-zinc-600">Legend</p>
            <Switch value={legend} setSelected={() => setLegend(!legend)} />
          </div>
        </div>

        <div className="flex flex-col space-y-2 justify-start items-start w-full">
          <div className="flex flex-row items-center justify-between space-x-2 border-b w-full">
            <MiniSelect
              title="X Axis"
              options={xOptions}
              setSelected={(x) => setXAxis(x.value)}
              selected={xOptions.find(
                (x: typeof xOptions[0]) => x.title === xAxis
              )}
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2 w-full">
            <p className="text-sm font-semibold text-zinc-600">Custom title</p>
            <TextInput
              id="xAxisLabel"
              name="xAxisLabel"
              value={xAxisLabel || ""}
              handleChange={setXAxisLabel}
              type="text"
              label="Name"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2 w-full">
            <p className="text-sm font-semibold text-zinc-600">Show X Axis</p>
            <Switch
              value={showXAxis}
              setSelected={() => setshowXAxis(!showXAxis)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 justify-start items-start w-full">
          <div className="flex flex-row items-center justify-between space-x-2 border-b w-full">
            <MiniSelect
              title="Y Axis"
              options={yOptions}
              setSelected={(x) => setYAxis(x.value)}
              selected={yOptions.find(
                (x: typeof yOptions[0]) => x.title === yAxis
              )}
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2 w-full">
            <p className="text-sm font-semibold text-zinc-600">Custom title</p>
            <TextInput
              id="yAxisLabel"
              name="yAxisLabel"
              value={yAxisLabel || ""}
              handleChange={setYAxisLabel}
              type="text"
              label="Name"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2 w-full">
            <p className="text-sm font-semibold text-zinc-600">Show Y Axis</p>
            <Switch
              value={showYAxis}
              setSelected={() => setshowYAxis(!showYAxis)}
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2 w-full">
            <p className="text-sm font-semibold text-zinc-600">Min</p>
            <TextInput
              id="yAxisMin"
              name="yAxisMin"
              value={yAxisMin || ""}
              handleChange={(e) => setYAxisMin(parseInt(e, 10))}
              type="number"
              label="0"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2 w-full">
            <p className="text-sm font-semibold text-zinc-600">Max</p>
            <TextInput
              id="yAxisMax"
              name="yAxisMax"
              value={yAxisMax || ""}
              handleChange={(e) => setYAxisMax(parseInt(e, 10))}
              type="number"
              label="100"
            />
          </div>
        </div>

        <div className="ml-auto ">
          <Button
            label="Save"
            type="secondary"
            onClick={() => (chart ? updateChart() : openSaveDialog())}
          />
        </div>
      </div>
      <div className="col-span-7 flex flex-col h-full w-full">
        <ChartView
          data={data}
          fields={fields}
          chartType={chartType || "line"}
          chart_meta_data={chart_meta_data}
        />
      </div>
    </div>
  );
};

export default ChartContainer;
