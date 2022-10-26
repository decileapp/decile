import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import axios from "axios";

// Set cookies
export const setAuthCookieForServer = async (
  event: AuthChangeEvent,
  session: Session | null
) => {
  await axios({
    url: `${process.env.NEXT_PUBLIC_ORIGIN}api/auth`,
    method: "POST",
    data: { event, session },
    headers: new Headers({ "Content-Type": "application/json" }),
  });
  return;
};
