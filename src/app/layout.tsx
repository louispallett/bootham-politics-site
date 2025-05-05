import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
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
        <div className="flex flex-col min-h-screen justify-between w-full">
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
          <div>
            <p>This is a Next.js application.</p>
            <p>This application is not an official Bootham School application.</p>
          </div>
          <p><a href="https://github.com/louispallett" className="text-slate-700">© 2025 Louis Pallett</a></p>
      </div>
    </footer>
  )
}
