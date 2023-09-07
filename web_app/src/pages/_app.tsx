import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import NavBar from "~/components/navbar";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Tank Test Data Generation</title>
        <meta name="description" content="A WHACK project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <NavBar />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
};

export default MyApp;
