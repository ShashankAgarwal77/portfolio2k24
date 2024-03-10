import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Head from 'next/head';


const workSans = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shashank Agarwal | Product Designer and Developer",
  description: "A UX portfolio website of Shashank Agarwal. Designed & Developed by Shashank Agarwal using NextJs, Typescript and Framer Motion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
