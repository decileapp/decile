import "../styles/globals.css";
import React, { FC, useMemo } from "react";
import type { AppProps } from "next/app";
import AppLayout from "../components/layouts/AppLayout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { event } from "../utils/mixpanel";
import { UserProvider } from "@auth0/nextjs-auth0";

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
  }, [router.query, router.isReady]);

  return (
    <UserProvider>
      <ThemeProvider attribute="class">
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
