export interface Schedule {
  id: number;
  created_at: Date;
  name: string;
  frequency: string;
  run_at: Date;
  user_id: string;
  org_id: number;
  export_id: {
    id: number;
    queryId: { name: string; id: number };
    spreadsheet: string;
  };
}
