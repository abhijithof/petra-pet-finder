import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pet.Ra - Find Your Perfect Pet</title>
        <meta name="description" content="Find your perfect pet with Pet.Ra's advanced pet matching service. Tell us what you're looking for and we'll find the perfect match." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/petra-logo-blue-2.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/petra-logo-blue-2.png" />
        <link rel="apple-touch-icon" href="/petra-logo-blue-2.png" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
