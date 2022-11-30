export interface CommonProps {
  yAxis: string;
  xAxis: string;
  legend?: boolean;
  valueLabels?: boolean;
  xAxisMin?: number;
  xAxisMax?: number;
  yAxisMin?: number;
  yAxisMax?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

// Only common elements for graphs
export interface ChartInput {
  title: string;
  description?: string;
  chart_type: string;
  chart_meta_data: CommonProps;
  query_id: string;
  public_chart: boolean;
  user_id: string;
  org_id: string;
}

export interface Chart {
  id: string;
  title: string;
  description?: string;
  chart_type: string;
  chart_meta_data: CommonProps;
  query_id: {
    id: string;
    name: string;
  };
  public_chart: boolean;
  user_id: { id: string; email: string };
  org_id: string;
  created_at: Date;
}
