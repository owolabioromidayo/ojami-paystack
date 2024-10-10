import "@/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { OjaProvider } from "@/components/provider";
import TopBarProgress from "react-topbar-progress-indicator";
import React from "react";
import { Router } from "next/router";

const general = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  weight: "100 900",
  variable: "--font-general-sans",
});

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [progress, setProgress] = React.useState(false);

  Router.events.on("routeChangeStart", () => {
    setProgress(true);
  });
  Router.events.on("routeChangeComplete", () => {
    setProgress(false);
  });
  TopBarProgress.config({
    barColors: {
      "0": "#EF8421",
      "0.5": "#2BADE5",
      "1.0": "#A580FF",
    },
  });

  return (
    <ChakraProvider>
      <Head>
        <title>ọjà mi | A New Shopping Experience </title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icons/oja.svg" />
        <link rel="shortcut icon" href="/icons/oja.svg" />
        <link rel="mask-icon" href="/icons/oja.svg" color="#FFFFFF" />
        <link rel="apple-touch-startup-image" href="/pwa/splash-screen.png" sizes="430x932" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/oja-512.png" />
        <link rel="apple-touch-icon" sizes="246x246" href="/icons/oja-246.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/oja-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Oja Mi" />
        <meta property="og:description" content="A new shopping experience, powered by Kora Payments" />
        <meta property="og:site_name" content="oja mi" />
        <meta property="og:url" content="https://ojami.shop" />
        <meta property="og:image" content="/pwa/thumbnail.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <main className={`${general.className}`} style={{ background: "#FFF9E5" }}>
        <OjaProvider>
        {progress && <TopBarProgress />}
        {getLayout(<Component {...pageProps} />)}
          <Analytics />
        </OjaProvider>
      </main>
    </ChakraProvider>
  );
}
