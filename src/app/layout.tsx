import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";
import MarketingScripts from "@/components/MarketingScripts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Chef Lucas Medeiros",
  description: "Orçamento interativo para eventos com o Chef Lucas Medeiros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-light text-brand-dark">
        <MarketingScripts />
        {children}
      </body>
    </html>
  );
}
