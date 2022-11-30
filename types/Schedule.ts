import { Database } from "./database.types";

export type Schedule = Database["public"]["Tables"]["schedule"]["Row"] & {
  user_id: {
    id: string;
    email: string;
  };
  export_id: {
    id: string;
    query_id: {
      id: string;
      name: string;
    };
    spreadsheet: string;
  };
};

export type ScheduleInput = Database["public"]["Tables"]["schedule"]["Insert"];
