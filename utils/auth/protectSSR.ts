import { User } from "@supabase/supabase-js";

export default function protectSSR(user: User | null, token: string | null) {
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  // Admins only
  if (user.user_metadata.role_id !== 1) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  return;
}
