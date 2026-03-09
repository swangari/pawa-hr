import React from "react";
import type { Metadata } from "next";
import { Source_Sans_3, Instrument_Sans } from "next/font/google";
import Provider from "../components/sessionProvider";
import "./globals.css";
// import SidebarWrapper from "./components/sidebarWrapper";
// import Header from "./components/header";
import { Toaster } from "react-hot-toast";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "Pawa HR",
  description: "Pawa HR Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined|Material+Icons+Round"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={`${sourceSans.variable} ${instrumentSans.variable} font-sans antialiased`}
      >
        <Provider>
          <div className="flex h-screen overflow-hidden">
            {/* <SidebarWrapper /> */}
            <main className="flex-1  bg-[#F8FAFC] overflow-y-auto">
              {/* <Header /> */}
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "text-sm font-medium",
              duration: 4000,
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
