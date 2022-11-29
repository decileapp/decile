import { Database } from "./database.types";

export type Export = Database["public"]["Tables"]["export"]["Row"] & {
  created_at: Date;
};
