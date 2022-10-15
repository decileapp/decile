import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import AppLayout from "../components/layouts/AppLayout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { event } from "../utils/mixpanel";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import axios from "axios";
import { RecoilRoot } from "recoil";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Mix panel events
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      //Send track event when new pages is loaded
      event("Page view", {
        url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Set cookies
  const handleAuthChange = async (
    event: AuthChangeEvent,
    session: Session | null
  ) => {
    await axios({
      url: "/api/auth",
      method: "POST",
      data: { event, session },
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return;
  };

  // For supabase log in
  useEffect(() => {
    if (!router.isReady) return;

    // Detect auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(_event, session);
      return;
    });
  }, [router.query, router.isReady]);

  return (
    <ThemeProvider attribute="class">
      <RecoilRoot>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default MyApp;
