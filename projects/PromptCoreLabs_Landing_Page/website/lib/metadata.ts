import type { Metadata } from "next";

export const siteUrl = "https://promptcore.com.br";

export const siteTitle =
  "PromptCore Labs — Bunker de Soberania Digital, IA Própria e Governança ISO 27001 / ISO 42001";

export const siteDescription =
  "A PromptCore Labs ajuda startups, empresas e ecossistemas de inovação a estruturar processos, dados, automações e agentes de IA com governança, contexto e visão de crescimento. Modelos privados, resiliência e atuação Forward Deployed.";

const socialImage = {
  url: "/og/promptcore-labs-og.png",
  width: 1200,
  height: 630,
  alt: "PromptCore Labs - Bunker de Soberania Digital, Governança e IA Própria",
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PromptCore Labs — Bunker de Soberania Digital, Governança & IA Própria",
    description:
      "Arquitetura, IA e operação para transformar ideias em empresas mais inteligentes. Modelos privados, conformidade ISO 27001 e ISO 42001 e atuação técnica Forward Deployed.",
    url: siteUrl,
    siteName: "PromptCore Labs",
    locale: "pt_BR",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptCore Labs — Bunker de Soberania Digital & IA Própria",
    description:
      "Arquitetura, IA e operação para transformar ideias em empresas mais inteligentes. Modelos privados, conformidade ISO 27001 e ISO 42001.",
    images: ["/og/promptcore-labs-twitter.png"],
  },
  keywords: [
    "PromptCore Labs",
    "Bunker de Soberania Digital",
    "Soberania Tecnológica",
    "IA Própria",
    "Modelos Privados",
    "ISO 27001",
    "ISO 42001",
    "Governança de IA",
    "Segurança da Informação",
    "AI Forward Deployed Architect",
    "Eduardo Machado",
    "Engenharia de Contexto",
    "Sistemas Agênticos",
    "MCP",
    "Model Context Protocol",
    "EBITDA Shield",
    "RevOps",
    "CRM",
    "Resiliência Digital",
    "PCL AEOS",
  ],
};
