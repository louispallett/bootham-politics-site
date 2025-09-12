import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./styles/styles.css";
import Link from "next/link";

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
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main 
            className="flex-1 mx-2.5 md:mx-16 lg:mx-36 2xl:mx-64 flex flex-col mb-16"
          >{children}</main>
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
        <div className="flex justify-center items-center text-white">
            <img src="/images/big-ben.svg" alt="" className="h-16"/>
            <div className="flex flex-col">
            <h4>Bootham School</h4>
            <h6 className="text-right">Politics Department</h6>
            </div>
        </div>
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
