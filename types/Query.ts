export interface Query {
  id: number;
  name: string;
  database?: string;
  body?: string;
  publicQuery: boolean;
  updated_at: Date;
  user_id: string;
}
