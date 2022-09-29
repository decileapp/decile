import { ResponsiveLine, Serie } from "@nivo/line";
import { Graph } from "../../types/Graph";

interface BarProps extends Graph {
  data: any[];
}

const LineChart: React.FC<BarProps> = (props) => {
  const { xAxis, yAxis, data } = props;
  console.log(data);
  const sample = [
    {
      id: "japan",
      color: "hsl(138, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 23,
        },
        {
          x: "helicopter",
          y: 101,
        },
        {
          x: "boat",
          y: 176,
        },
        {
          x: "train",
          y: 162,
        },
        {
          x: "subway",
          y: 191,
        },
        {
          x: "bus",
          y: 178,
        },
        {
          x: "car",
          y: 237,
        },
        {
          x: "moto",
          y: 254,
        },
        {
          x: "bicycle",
          y: 20,
        },
        {
          x: "horse",
          y: 175,
        },
        {
          x: "skateboard",
          y: 210,
        },
        {
          x: "others",
          y: 94,
        },
      ],
    },
  ];

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: xAxis,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxis,
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
export default LineChart;
