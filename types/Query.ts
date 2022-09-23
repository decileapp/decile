export interface Query {
  id: string;
  name: string;
  database?: string;
  body: string;
  publicQuery: boolean;
  user_id: string;
  updated_at: Date;
}
