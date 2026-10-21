import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-bg ${jetBrainsMono.className}`}>
        <div className="container mx-auto">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
