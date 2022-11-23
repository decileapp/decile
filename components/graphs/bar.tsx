import { BarCommonProps, BarSvgProps, ResponsiveBar } from "@nivo/bar";
import { useTheme } from "next-themes";
import { CommonProps } from "../../types/Chart";
import colors from "../../utils/theme/colors";
import { graphTheme, marginProps } from "./common/graphTheme";

interface BarProps extends CommonProps {
  data: any[];
  indexBy?: string;
  horizontal?: boolean;
}

const Bar: React.FC<BarProps> = (props) => {
  const {
    data,
    xAxis,
    xAxisLabel,
    yAxisLabel,
    yAxis,
    legend,
    horizontal,
    valueLabels,
    yAxisMax,
    yAxisMin,
    showXAxis,
    showYAxis,
  } = props;
  const { theme } = useTheme();
  return (
    <ResponsiveBar
      theme={graphTheme(theme)}
      colors={colors.violet[500]}
      margin={marginProps(legend)}
      padding={0.3}
      data={data}
      indexBy={xAxis}
      keys={[yAxis]}
      layout={horizontal ? "horizontal" : "vertical"}
      ariaLabel="bar chart"
      enableLabel={valueLabels}
      labelTextColor="black"
      minValue={yAxisMin ? yAxisMin : "auto"}
      maxValue={yAxisMax ? yAxisMax : "auto"}
      axisBottom={
        showXAxis
          ? {
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: xAxisLabel ? xAxisLabel : xAxis,
              legendPosition: "middle",
              legendOffset: 100,
            }
          : null
      }
      axisLeft={
        showYAxis
          ? {
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: yAxisLabel ? yAxisLabel : yAxis,
              legendPosition: "middle",
              legendOffset: -80,
            }
          : null
      }
      axisTop={null}
      axisRight={null}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={
        legend
          ? [
              {
                dataFrom: "keys",
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

export default Bar;
