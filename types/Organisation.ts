import { Database } from "./database.types";

export type Organisation = Database["public"]["Tables"]["organisations"]["Row"];

export interface Org_User {
  id: string;
  org_id: number;
  user_id: { id: string; email: string };
  role_id: number;
}
