import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Head from 'next/head';

// Import the PNG file
const MetaDataThumbnail = require('@/app/Assets/Images/MetaDataThumbnail.png') as string;


const workSans = Work_Sans({ subsets: ["latin"] });

// Define a custom type for metadata with image
interface CustomMetadata extends Metadata {
  image: string; // Assuming MetaDataThumbnail is a local path
}

// Define the metadata
export const metadata: CustomMetadata = {
  title: "Shashank Agarwal | Product Designer and Developer",
  description: "A UX portfolio website of Shashank Agarwal. Designed & Developed by Shashank Agarwal using NextJs, Typescript and Framer Motion",
  // Provide the local path to the imported PNG file
  image: MetaDataThumbnail as string, // Type assertion
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
