import type { Metadata } from "next";

import "./styles/styles.css";
import Link from "next/link";
import ThemeSetter from "./ThemeSetter";

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
      <link rel="icon" type="image/svg+xml" href="/images/big-ben.svg" />
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="main-parent">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="flex justify-between gap-2.5">
      <Link href="/" className="cursor-pointer">
        <div className="header-title-wrapper">
          <img src="/images/big-ben.svg" alt="" className="h-16" />
          <div>
            <h4 className="text-white!">Bootham School</h4>
            <h6 className="text-white! text-right">Politics Department</h6>
          </div>
        </div>
      </Link>
      <ThemeSetter />
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>This application is not an official Bootham School application.</p>
      <div className="flex flex-col items-end">
        <a
          href="/admin/home"
          className="text-sm text-yellow-400! focus:text-yellow-300! hover:text-yellow-200!"
        >
          Administrator
        </a>
        <p>
          <a
            href="https://github.com/louispallett"
            className="text-sm text-yellow-400! focus:text-yellow-300! hover:text-yellow-200!"
          >
            © 2025 Louis Pallett
          </a>
        </p>
      </div>
    </footer>
  );
}
