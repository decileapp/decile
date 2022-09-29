import { string } from "yup";

export interface Role {
  role: string;
  user_id: {
    id: string;
    email: string;
  };
  org_id: {
    id: string;
    name: string;
  };
}
