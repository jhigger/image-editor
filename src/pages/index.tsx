import Head from "next/head";
import ImageEditor from "~/components/ImageEditor";

export default function Home() {
  return (
    <>
      <Head>
        <title>Image Editor</title>
        <meta name="description" content="Image Editor made by Kairos" />
        <link rel="icon" href="/kairos.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <ImageEditor />
      </main>
    </>
  );
}
