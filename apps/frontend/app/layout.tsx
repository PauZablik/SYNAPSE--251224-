import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: "SYNAPSE - Engineering Document Management",
  description: "Professional platform for Construction Technical Office engineers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
