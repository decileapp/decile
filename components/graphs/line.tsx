import { ResponsiveLine, Serie } from "@nivo/line";
import { useTheme } from "next-themes";
import { CommonProps } from "../../types/Chart";
import colors from "../../utils/theme/colors";
import { graphTheme, marginProps } from "./graphTheme";

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
        tickRotation: 0,
        legend: xAxisLabel,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLabel,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default Line;
