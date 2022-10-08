export interface Schedule {
  id?: number;
  created_at?: Date;
  name: string;
  periodicity: string;
  run_at_time: number;
  run_at_day: number;
  run_at_month_date: number;
  user_id: string;
  org_id: number;
  export_id: number;
  timestamp_utc: string;
  timestamp_user_zone: string;
  timezone: string;
}