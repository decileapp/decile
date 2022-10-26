import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../supabaseClient";
import { includes } from "lodash";
import { User } from "@supabase/supabase-js";

const protectServerRoute = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Check user
      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      const pathname = req.url || "";

      // Path
      // Only admin roles
      const isAdminRoute = (pathname: string) => {
        return pathname.startsWith("/api/admin");
      };

      // Only user roles, assigned to org
      const isUserRoute = (pathname: string) => {
        return pathname.startsWith("/api/user");
      };

      // Only internal to app
      const isInternalRoute = (pathname: string) => {
        return pathname.startsWith("/api/internal");
      };

      // Before user is assigned to org
      const isOrgRoute = (pathname: string) => {
        return pathname.startsWith("/api/org");
      };

      // Org routes
      if (isOrgRoute(pathname) && !user) {
        res.status(401).json({ message: "Not authorised" });
        return;
      }

      // User routes
      if (
        isUserRoute(pathname) &&
        ![1, 2].includes(user?.user_metadata.role_id)
      ) {
        res.status(401).json({ message: "Not authorised" });
        return;
      }

      // Admin routes
      if (isAdminRoute(pathname) && user?.user_metadata.role_id !== 1) {
        res.status(401).json({ message: "Not authorised" });
        return;
      }

      // Internal routes
      if (
        isInternalRoute(pathname) &&
        (!req.headers["authorization"] ||
          req.headers["authorization"] !== `Bearer ${process.env.BEARER_TOKEN}`)
      ) {
        res.status(401).json({ message: "Not authorised" });
        return;
      }

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Please log in to get access.",
      });
    }
  };
};
export default protectServerRoute;
