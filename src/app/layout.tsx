import { Metadata as NextMetadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

import Image from 'next/image'

const workSans = Work_Sans({ subsets: ["latin"] });

import MetaThumbnail from '@/app/Assets/Images/metaImage.jpg';

// Define the OGImage type
type OGImage = {
  url: string;
};

// Update the Metadata type
type Metadata = {
  title: string;
  description: string;
  openGraph: {
    images: OGImage[];
  };
};

// Now, you can use the Metadata type for your metadata object
export const metadata: Metadata = {
  title: "Shashank Agarwal | Product Designer and Developer",
  description: "A UX portfolio website of Shashank Agarwal.",
  openGraph: {
    images: [
      {
        url: MetaThumbnail.src,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {metadata?.openGraph?.images &&
          Array.isArray(metadata.openGraph.images) &&
          metadata.openGraph.images.map((image, index) => (
            <meta key={index} property="og:image" content={image.url} />
          ))}
      </head>

      <body>{children}</body>
    </html>
  );
}
