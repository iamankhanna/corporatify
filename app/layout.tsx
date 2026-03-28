import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corpartify",
  description:
    "Turn raw thoughts into polished professional communication while keeping the original intent."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
