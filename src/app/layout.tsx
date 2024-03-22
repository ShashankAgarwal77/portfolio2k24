import { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({ subsets: ["latin"] });

// Now, you can use the Metadata type for your metadata object
export const metadata: Metadata = {
  title: "Shashank Agarwal | Product Designer and Developer",
  description: "A UX portfolio website of Shashank Agarwal.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="https://shashankagarwal.netlify.app/metaImage.jpg" />

      </head>

      <body>{children}</body>
    </html>
  );
}
