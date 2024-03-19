import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Image from 'next/image'; // Import Image component from Next.js
import MetaThumbnail from '../../public/MetaDataThumbnail.png'; // Import the image locally

const workSans = Work_Sans({ subsets: ["latin"] });

// Define a new type extending Metadata to include the image property
interface CustomMetadata extends Metadata {
  image: string;
}

// Cast metadata object to CustomMetadata type
const metadata: CustomMetadata = {
  title: "Shashank Agarwal | Product Designer and Developer",
  description: "A UX portfolio website of Shashank Agarwal.",
  image: '/MetaDataThumbnail.png' // Update the image path
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Use the imported image */}
      <Image src={MetaThumbnail} alt="Logo" width={100} height={100} />
      <body>{children}</body>
    </html>
  );
}

export { metadata };
