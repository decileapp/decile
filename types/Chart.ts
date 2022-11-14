export interface CommonProps {
  yAxis: string;
  xAxis: string;
  legend?: boolean;
  valueLabels: boolean;
  minValue?: number;
  maxValue?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Only common elements for graphs
export interface Graph {
  id?: number;
  title?: string;
  description?: string;
  chart_type: string;
  chart_meta_data: CommonProps;
  query_id: number;
  user_id: string;
  org_id: number;
}
