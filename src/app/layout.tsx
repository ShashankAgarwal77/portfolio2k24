"use client";
// import { Metadata } from "next";

import React from 'react';

import localFont from 'next/font/local';

const satoshi = localFont({ src: './Assets/fonts/Satoshi/Satoshi-Variable.ttf', variable: '--font-satoshi', display: 'swap' });


// import { Work_Sans } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/uiFrontend/custom-cursor";
import { SiteLoader } from "./components/SiteLoader";

/* Runs before first paint, so both decisions land before anything renders:

   1. Theme — apply the stored dark-mode preference (default dark, same as
      ThemeSwitcher) to <html> immediately. Without this the first paint is
      always light and snaps dark after hydration.

   2. The veil — on the first landing of a session (and only when motion is
      allowed and the tab is visible), raise `data-veil` so the site loader
      is visible from the very first frame and page reveals wait for it.
      See SiteLoader and useReveal for the other half of this contract. */
const bootScript = `(function () {
  var d = document.documentElement;
  try {
    var p = localStorage.getItem('darkMode');
    if (p === null || JSON.parse(p)) d.classList.add('dark');
  } catch (e) { d.classList.add('dark'); }
  try {
    if (
      !sessionStorage.getItem('sa:loader-shown') &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      document.visibilityState === 'visible'
    ) d.setAttribute('data-veil', '');
  } catch (e) {}
})();`;

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
  return (
    // suppressHydrationWarning: the boot script legitimately mutates the
    // <html> class (theme) and attributes (data-veil) before React hydrates.
    <html lang="en" className={`${satoshi.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
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

      <body>
        <SiteLoader />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
