import type { Metadata as NextMetadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

// Extend the Metadata type to include the image property
interface Metadata extends NextMetadata {
  image?: {
    url: string;
    alt: string;
  };
  // Add the og:image property
  "og:image"?: string;
}

const workSans = Work_Sans({ subsets: ["latin"] });

// Define the relative path to your image
const imagePath = "/Assets/Images/MetaDataThumbnail.png";

export const metadata: Metadata = {
  title: "Shashank Agarwal | Product Designer and Developer",
  description: "A UX portfolio website of Shashank Agarwal.",
  // Add image metadata with the relative path
  image: {
    url: imagePath,
    alt: "Description of your image",
  },
  // Add the og:image property
  "og:image": imagePath, // Use the same imagePath for og:image
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
