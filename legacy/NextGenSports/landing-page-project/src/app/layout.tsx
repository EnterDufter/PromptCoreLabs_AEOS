import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "NextGen Sports | Plataforma SportTech institucional",
  description:
    "Plataforma SportTech para desenvolvimento de talentos, inteligência de performance, posicionamento de marca e estruturação de parcerias esportivas.",
  keywords: [
    "NextGen Sports",
    "SportTech",
    "talentos esportivos",
    "automobilismo",
    "kartismo",
    "patrocínio esportivo",
    "performance esportiva"
  ],
  openGraph: {
    title: "NextGen Sports | Plataforma SportTech institucional",
    description:
      "Desenvolvimento de talentos, performance, narrativa institucional e parcerias para carreiras esportivas emergentes.",
    type: "website",
    locale: "pt_BR"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
