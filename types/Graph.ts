interface GraphData {
  x: string | number;
  y: string | number;
}

// Only common elements for graphs
export interface Graph {
  xAxis: string;
  yAxis: string;
  title?: string;
  colo?: string;
}
