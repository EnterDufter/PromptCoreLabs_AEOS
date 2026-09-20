import { faqItems } from "@/content/faq";
import { siteDescription, siteUrl } from "@/lib/metadata";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PromptCore Labs",
    url: siteUrl,
    description:
      "Empresa de IA aplicada, automação e arquitetura operacional para startups, empresas e ecossistemas de inovação.",
    areaServed: "Brasil",
    knowsAbout: [
      "IA aplicada",
      "arquitetura operacional",
      "automação inteligente",
      "agentes de IA",
      "engenharia de contexto",
      "engenharia de harness",
      "governança cognitiva",
      "human-in-the-loop",
      "CRM",
      "RevOps",
      "Project.OS",
      "ecossistemas de inovação",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PromptCore Labs",
    url: siteUrl,
    description: siteDescription,
    publisher: {
      "@type": "Organization",
      name: "PromptCore Labs",
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
