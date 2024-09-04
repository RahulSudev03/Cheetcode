import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "./utils/Analytics";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cheetcode",
  description: "A literal cheat code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></script>
          <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS});`}
        </script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
