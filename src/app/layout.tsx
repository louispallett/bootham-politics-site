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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 mx-2.5 md:mx-5 flex flex-col">{children}</main>
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
        <a href="/admin/home" className="text-sm text-yellow-400! focus:text-yellow-300! hover:text-yellow-200!">Administrator</a>
        <p><a href="https://github.com/louispallett" className="text-sm text-yellow-400! focus:text-yellow-300! hover:text-yellow-200!">© 2025 Louis Pallett</a></p>
      </div>
    </footer>
  )
}
