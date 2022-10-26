import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import AppLayout from "../components/layouts/AppLayout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { event } from "../utils/mixpanel";
import { supabase } from "../utils/supabaseClient";
import { RecoilRoot } from "recoil";
import "react-toastify/dist/ReactToastify.css";
import { setAuthCookieForServer } from "../utils/auth/setAuthCookie";

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

  // For supabase log in
  useEffect(() => {
    if (!router.isReady) return;

    // Detect auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthCookieForServer(_event, session);
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
