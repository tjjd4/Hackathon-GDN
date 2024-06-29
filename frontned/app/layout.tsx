"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] });

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <EnokiFlowProvider apiKey={process.env.ENOKI_PUB_KEY!}>
          <body className={inter.className}>
          <div className="flex flex-col z-30">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-start">
            <nav className="flex gap-2">
      <Link href="/">
        <div className="border border-black rounded-3xl w-20 flex justify-center">
        Home
        </div>
        
      </Link>
      <Link href="/market">
      <div className="border border-black rounded-3xl w-20 flex justify-center">
        Market
        </div>
      </Link>
      </nav>
            </header>
            {children}
          </div>
          </body>
          <Analytics />
          <Toaster closeButton  />
        </EnokiFlowProvider>
      </SuiClientProvider>
    </html>
  );
}
