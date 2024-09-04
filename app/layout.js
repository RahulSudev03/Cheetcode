import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "./utils/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cheetcode",
  description: "A literal cheat code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
