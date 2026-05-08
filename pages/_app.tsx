import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pet.Ra - Find Your Perfect Pet in Kochi</title>
        <meta name="description" content="Pet.Ra helps you find your perfect pet in Kochi. Verified breeders, personalised matching, and pet care subscription plans." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/petra-logo-blue-2.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/petra-logo-blue-2.png" />
        <link rel="apple-touch-icon" href="/petra-logo-blue-2.png" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
}
