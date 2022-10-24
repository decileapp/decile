interface Column {
  title: string;
  type: string;
}

export interface Schema {
  title: string;
  columns?: Column[];
}
