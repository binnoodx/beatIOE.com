import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "./sessionWrapper";
import RouteLoader from "@/components/routerLoder";
import "katex/dist/katex.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next"



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "crackIOE",
  description: "Crack IOE Exam with this website",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><RouteLoader/>
          <NextAuthSessionProvider>
            {children}
            <SpeedInsights/>
            </NextAuthSessionProvider>  

      </body>
    </html>
  );
}
