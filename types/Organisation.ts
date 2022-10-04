export interface Organisation {
  id: number;
  name: string;
  user_id: string;
  plan_id: number;
}

export interface Org_User {
  id: string;
  org_id: number;
  user_id: { id: string; email: string };
  role_id: number;
}
