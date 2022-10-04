export interface Query {
  id: string;
  name: string;
  database?: string;
  body?: string;
  publicQuery: boolean;
  updated_at: Date;
  user_id: {
    id: string;
    email: string;
  };
}
