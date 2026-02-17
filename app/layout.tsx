import "./globals.css";
import type { Metadata } from "next";
import { Bitter } from "next/font/google";

export const metadata: Metadata = {
  title: "Mia 15",
  icons: {
    icon: "../public/icon.svg",
  },
};

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// problemas de hidratacion en este componente

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bitter.className}>{children}</body>
    </html>
  );
}
