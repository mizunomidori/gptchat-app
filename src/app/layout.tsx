import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProviderAuth } from "./hooks/use-auth";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAG AI Chat App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProviderAuth>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ProviderAuth>
  );
}
