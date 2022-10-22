interface Column {
  title: string;
  format: string;
  type: string;
  default: any;
  required: boolean;
  pk: boolean;
  fk?: string | undefined;
}

export interface Schema {
  title: string;
  columns?: Column[];
}
