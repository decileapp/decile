import { Serie } from "@nivo/line";
import { ReactElement } from "react";
import Bar from "../bar";
import Line from "../line";
import Scatter from "../scatter";
import { Chart, CommonProps } from "../../../types/Chart";
import _ from "lodash";

interface Props {
  fields: string[];
  data: any;
  chartType: string;
  chart_meta_data: CommonProps;
}

const ChartView: React.FC<Props> = (props) => {
  const { chartType, chart_meta_data, data, fields } = props;

  const {
    xAxis,
    xAxisLabel,
    showXAxis,
    showYAxis,
    yAxis,
    yAxisLabel,
    yAxisMin,
    yAxisMax,
    legend,
    valueLabels,
  } = chart_meta_data;
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

  return comp;
};

export default ChartView;
