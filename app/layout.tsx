import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-archivo",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-ink text-white antialiased ${archivo.variable} ${mono.variable}`}
      >
        <div className="container mx-auto">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
