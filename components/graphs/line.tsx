import { ResponsiveLine, Serie } from "@nivo/line";
import { useTheme } from "next-themes";
import { CommonProps } from "../../types/Chart";
import colors from "../../utils/theme/colors";
import { graphTheme, marginProps } from "./common/graphTheme";

interface LineProps extends CommonProps {
  data: Serie[];
}

const Line: React.FC<LineProps> = (props) => {
  const { data } = props;
  const {
    xAxis,
    xAxisLabel,
    yAxisLabel,
    yAxis,
    legend,
    valueLabels,
    minValue,
    maxValue,
  } = props;
  const { theme } = useTheme();

  return (
    <ResponsiveLine
      data={data}
      colors={colors.violet[500]}
      theme={graphTheme(theme)}
      margin={marginProps(legend)}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: xAxisLabel ? xAxisLabel : xAxis,
        legendPosition: "middle",
        legendOffset: 100,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLabel ? yAxisLabel : yAxis,
        legendPosition: "middle",
        legendOffset: -80,
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        legend
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : []
      }
    />
  );
};

export default Line;
