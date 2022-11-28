import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { encrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { supabase } from "../../../../utils/supabaseClient";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  // CREATE NEW SOURCE
  if (req.method === "POST") {
    try {
      // Check user
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401);
      }
      const { user } = session;

      const { name, dbUser, host, database, password, port, ssl } = req.body;

      // Check connection
      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: password,
        port: port,
        ssl: ssl,
      });

      const tables = await pool.query(
        "SELECT table_name FROM information_schema.tables limit 10"
      );

      if (!tables) {
        res.status(500).json({ error: "Failed to connect to DB" });
        return;
      }

      let { data, error } = await supabase
        .from("sources")
        .insert({
          name: name,
          database: database,
          host: host,
          dbUser: dbUser,
          password: encrypt(password),
          port: parseInt(port, 10),
          ssl: ssl,
          user_id: user?.id,
          org_id: user.user_metadata.org_id,
        })
        .select("id")
        .single();

      if (!data) {
        res.status(400).json({});
        return;
      }

      res.status(200).json({ id: data?.id });
      return;
    } catch (e: any) {
      console.error(e);

      throw new Error(`Something went wrong.`);
    }
  }

  // EDIT SOURCE
  if (req.method === "PATCH") {
    try {
      // Check user
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401);
      }
      const { user } = session;

      const { id, name, dbUser, host, database, password, port, ssl } =
        req.body;
      // Check connection
      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: password,
        port: port,
        ssl: ssl,
      });

      const tables = await pool.query(
        "SELECT table_name FROM information_schema.tables limit 10"
      );

      if (!tables) {
        res.status(500).json({ error: "Failed to connect to DB" });
      }

      let { data, error } = await supabase
        .from("sources")
        .update({
          name: name,
          database: database,
          host: host,
          dbUser: dbUser,
          password: encrypt(password),
          port: port,
          ssl: ssl,
          user_id: user?.id,
        })
        .match({ id: parseInt(id, 10), user_id: user?.id })
        .select("id")
        .single();

      if (!data) {
        res.status(400).json({});
        return;
      }

      res.status(200).json({ id: data?.id });
      return;
    } catch (e: any) {
      console.error(e);

      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
