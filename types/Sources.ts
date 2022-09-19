export interface Source {
  id: string;
  name: string;
  database: string;
  host: string;
  dbUser: string;
  password: string;
  port: number;
  ssl: boolean;
  user_id: string;
}
