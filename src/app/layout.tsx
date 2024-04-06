import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Public Transport",
  description: "Public Transport in Vienna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/wordart.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
