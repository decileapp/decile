import { ResponsiveLine, Serie } from "@nivo/line";
import { ReactElement, useState } from "react";
import InputLabel from "../individual/common/InputLabel";
import MiniSelect from "../individual/MiniSelect";
import Bar from "./bar";
import Line from "./line";
import Scatter from "./scatter";

interface Props {
  fields: any;
  data: any;
}

const ChartContainer: React.FC<Props> = (props) => {
  const { data, fields } = props;

  // Chart details
  const [title, setTitle] = useState<string>();
  const [xAxis, setXAxis] = useState<string>(fields[0]);
  const [yAxis, setYAxis] = useState<string>(fields[1]);
  const [chartType, setChartType] = useState<string>("line");

  // Chart controls
  const [legend, setLegend] = useState(true);
  const [horizontal, setHorizontal] = useState(false);

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

  if (chartType === "line" && xAxis && yAxis) {
    const singleSeries = data.map((d: any) => {
      return { x: d[xAxis], y: d[yAxis] };
    });
    const formattedData: Serie[] = [{ id: "1", data: singleSeries }];
    comp = (
      <Line
        data={formattedData}
        xAxis={xAxis}
        xAxisLabel={xAxis}
        yAxis={yAxis}
        yAxisLabel={yAxis}
        valueLabels={true}
      />
    );
  }

  if (chartType === "scatter" && xAxis && yAxis) {
    const singleSeries = data.map((d: any) => {
      return { x: d[xAxis], y: d[yAxis] };
    });
    const formattedData = [{ id: "1", data: singleSeries }];
    comp = <Scatter data={formattedData} />;
  }

  if (chartType === "bar" && xAxis && yAxis) {
    const formattedData = data.map((d: any) => {
      return { x: d[xAxis], y: d[yAxis] };
    });
    comp = (
      <Bar
        data={data}
        xAxis={xAxis}
        xAxisLabel="Country"
        yAxisLabel="Emissions in millions of tonnes"
        yAxis={yAxis}
        legend={true}
        valueLabels={true}
      />
    );
  }

  return (
    <>
      <div className="flex flex-row justify-start items-center mb-2 space-x-8">
        <div className="flex flex-row space-x-2 justify-center items-center border p-1 rounded-lg bg-white dark:bg-zinc-700">
          <InputLabel title="X Axis" />
          <MiniSelect
            options={xOptions}
            setSelected={(x) => setXAxis(x.value)}
            selected={xOptions.find(
              (x: typeof xOptions[0]) => x.title === xAxis
            )}
          />
        </div>
        <div className="flex flex-row space-x-2 justify-center items-center border p-1 rounded-lg bg-white dark:bg-zinc-700">
          <InputLabel title="Y Axis" />
          <MiniSelect
            options={yOptions}
            setSelected={(x) => setYAxis(x.value)}
            selected={yOptions.find(
              (x: typeof yOptions[0]) => x.title === yAxis
            )}
          />
        </div>
        <div className="flex flex-row space-x-2 justify-center items-center border p-1 rounded-lg bg-white dark:bg-zinc-700">
          <InputLabel title="Chart type" />
          <MiniSelect
            options={chartOptions}
            setSelected={(x) => setChartType(x.value)}
            selected={chartOptions.find((x) => x.value === chartType)}
          />
        </div>
      </div>
      <div className="flex h-full w-full border">{comp}</div>
    </>
  );
};

export default ChartContainer;
