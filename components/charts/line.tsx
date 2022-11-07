import { LineChart } from "@tremor/react";

interface Props {
  data: any[];
}

const Line: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <LineChart
      data={data}
      categories={[]}
      dataKey=""
      colors={["violet"]}
      startEndOnly={false}
      showXAxis={true}
      showYAxis={true}
      yAxisWidth="w-14"
      showTooltip={true}
      showLegend={true}
      showGridLines={true}
      showAnimation={true}
      height="h-80"
      marginTop="mt-0"
    />
  );
};

export default Line;
