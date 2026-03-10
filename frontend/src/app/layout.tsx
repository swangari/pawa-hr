import React from "react";
import type { Metadata } from "next";
import { Source_Sans_3, Instrument_Sans } from "next/font/google";
import Provider from "../components/sessionProvider";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={`${sourceSans.variable} ${instrumentSans.variable} font-sans antialiased`}
      >
        <Provider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
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
