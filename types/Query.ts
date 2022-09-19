export interface Query {
  id: string;
  name: string;
  database: string;
  body: string;
  tags: string;
  publicQuery: boolean;
  user_id: string;
}
