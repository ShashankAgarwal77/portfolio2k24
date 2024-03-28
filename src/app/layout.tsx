// import { Metadata } from "next";

import Head from "next/head";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({ subsets: ["latin"] });

// Now, you can use the Metadata type for your metadata object
// export const metadata: Metadata = {
//   title: "Shashank Agarwal | Product Designer and Developer",
//   description: "A UX portfolio website of Shashank Agarwal.",
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Shashank Agarwal Digital Room</title>
        <meta name="description" content="A UX portfolio website of a product designer Shashank Agarwal." />
        <meta property="og:title" content="Shashank Agarwal | Product Designer and Developer" />
        <meta property="og:description" content="A UX portfolio website of a product designer Shashank Agarwal." />
        <meta property="og:image" content="https://shashankagarwal.netlify.app/metaImage.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shashankagarwal.netlify.app/" />
        {/* Add additional tags as needed */}
      </Head>

      <body>{children}</body>
    </html>
  );
}
