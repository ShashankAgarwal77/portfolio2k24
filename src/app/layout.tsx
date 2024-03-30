"use client";
// import { Metadata } from "next";

import React, { useEffect } from 'react';
import AOS from 'aos';
import './external_css/aos.css';

import localFont from 'next/font/local';

const satoshi = localFont({ src: './Assets/fonts/Satoshi/Satoshi-Variable.ttf', variable: '--font-satoshi', display: 'swap' });


// import { Work_Sans } from "next/font/google";
import "./globals.css";

// const workSans = Work_Sans({ subsets: ["latin"] });

// Now, you can use the Metadata type for your metadata object
// export const metadata: Metadata = {
//   title: "Shashank Agarwal | Product Designer and Developer",
//   description: "A UX portfolio website of Shashank Agarwal.",
// };


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);
  return (
    <html lang="en" className={`${satoshi.variable}`}>
      <head>
        {/* Primary Meta Tags */}
        <title>Shashank Agarwal Digital Room</title>
        <meta name="description" content="A UX portfolio website of a product designer Shashank Agarwal." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shashankagarwal.netlify.app/" />
        <meta property="og:title" content="Shashank Agarwal | Product Designer and Developer" />
        <meta property="og:description" content="A UX portfolio website of a product designer Shashank Agarwal." />
        <meta property="og:image" content="https://shashankagarwal.netlify.app/metaImage.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />

        {/* Twitter */}

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://shashankagarwal.netlify.app/" />
        <meta property="twitter:title" content="Shashank Agarwal | Product Designer and Developer" />
        <meta property="twitter:description" content="A UX portfolio website of a product designer Shashank Agarwal." />
        <meta property="twitter:image" content="https://shashankagarwal.netlify.app/metaImage.jpg" />

      </head>

      <body>{children}</body>
    </html>
  );
}
