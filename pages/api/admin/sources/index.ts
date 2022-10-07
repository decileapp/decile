import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { Source } from "../../../../types/Sources";
import { encrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { getServiceSupabase, supabase } from "../../../../utils/supabaseClient";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  // GET SOURCES
  if (req.method === "GET") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      if (!user || !token) {
        res.status(401).json({ error: "Not authorised" });
        return;
      }

      supabase.auth.setAuth(token);

      res.status(200).json({});
      return;
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  }

  // CREATE NEW SOURCE
  if (req.method === "POST") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      if (!user || !token) {
        return res.status(401);
      }

      supabase.auth.setAuth(token);

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
        "SELECT table_name FROM information_schema.tables where table_schema = 'public'"
      );

      if (!tables) {
        res.status(500).json({ error: "Failed to connect to DB" });
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
        .single();

      if (!data) {
        res.status(400).json({});
        return;
      }

      res.status(200).json({ id: data?.id });
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  }

  // EDIT SOURCE
  if (req.method === "PATCH") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      if (!user || !token) {
        return res.status(401);
      }

      supabase.auth.setAuth(token);

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
        "SELECT table_name FROM information_schema.tables where table_schema = 'public'"
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
        .single();

      if (!data) {
        console.log(error);
        res.status(400).json({});
        return;
      }

      res.status(200).json({ id: data?.id });
      return;
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
