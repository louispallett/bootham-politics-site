import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./styles/styles.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bootham Politics Hub",
  description: "", //! Add later
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
      >
        <div className="flex flex-col min-h-screen justify-between">
          <Header />
          <div className="mx-2.5 md:mx-5">
            <div className="flex justify-center">
              <main>{children}</main>
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header>
      <Link href="/" className="cursor-pointer">
        <img src="/images/bootham-logo.png" alt="" className="h-16"/>
      </Link>
      <div>
        <menu>

        </menu>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>This application is not an official Bootham School application.</p>
      <div className="flex flex-col items-end">
        <Link href="/admin/home" className="text-sm">Admin Page</Link>
        <p><a href="https://github.com/louispallett" className="text-slate-700">© 2025 Louis Pallett</a></p>
      </div>
    </footer>
  )
}
