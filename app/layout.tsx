import type { Metadata } from "next";
import { Caveat, Patrick_Hand, Gloria_Hallelujah } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  weight: "400",
});

const gloriaHallelujah = Gloria_Hallelujah({
  variable: "--font-gloria",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ideary",
  description: "Your digital idea diary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${patrickHand.variable} ${gloriaHallelujah.variable} h-full`}
    >
      <body className="min-h-full">
          <NavBar />
          {children}
        </body>
    </html>
  );
}
