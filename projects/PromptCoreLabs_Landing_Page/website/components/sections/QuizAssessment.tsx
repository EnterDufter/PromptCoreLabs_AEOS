"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { quizQuestions, calculateDiagnosis, BunkerDiagnosis } from "@/content/quiz";

export function QuizAssessment() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
  });

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentStep];

  // Cálculo de pontuação
  const calculateTotalScore = () => {
    return selectedAnswers.reduce((acc, points) => acc + points, 0);
  };

  const handleSelectOption = (points: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentStep] = points;
    setSelectedAnswers(updatedAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
    setIsSubmitted(false);
    setErrorMessage("");
  };

  const score = calculateTotalScore();
  const diagnosis: BunkerDiagnosis = calculateDiagnosis(score);

  const handleSubmitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const summaryText = quizQuestions
        .map((q, idx) => `Q${idx + 1} (${q.category}): ${selectedAnswers[idx] ?? 0} pts`)
        .join(" | ");

      const payload = {
        access_key: "f9f1bd77-c2a2-4635-b11d-2e95d5bc996c",
        subject: `[DIAGNÓSTICO BUNKER] Score: ${score}/100 - ${formData.nome}`,
        from_name: "PromptCore Labs LP v2 (Quiz Bunker)",
        Nome: formData.nome,
        Email: formData.email,
        WhatsApp: formData.whatsapp,
        "Score Bunker": `${score} / 100`,
        Diagnostico: diagnosis.title,
        Classificacao: diagnosis.badge,
        Resumo_Respostas: summaryText,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage("Ocorreu uma instabilidade ao enviar. Tente novamente.");
      }
    } catch {
      setErrorMessage("Erro na conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="diagnostico" className="section-band border-b border-vibrant-cyan/20 bg-surface-navy py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Pré-Assessment Executivo // ISO 27001 & ISO 42001"
          title="Descubra o Nível Bunker e a Maturidade Soberana da sua Empresa"
          description="Em 60 segundos, avalie sua exposição a vazamento de dados, dependência de plataformas externas e custos ocultos de IA. Diagnóstico preliminar e gratuito com recomendações cirúrgicas."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          {!isCompleted ? (
            /* Card do Quiz Interativo */
            <div className="border border-vibrant-cyan/30 bg-surface-panel p-6 shadow-cyan-glow/20 sm:p-8">
              {/* Barra de Progresso Superior */}
              <div className="mb-6 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-vibrant-cyan uppercase tracking-wider">
                    ETAPA {currentStep + 1} DE {totalQuestions} // {currentQuestion.category}
                  </span>
                  <span className="border border-vibrant-cyan/30 bg-surface-navy px-2 py-0.5 text-[10px] text-blueprint-gray">
                    {currentQuestion.isoTag}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-surface-navy">
                  <div
                    className="h-full bg-vibrant-cyan shadow-cyan-glow transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pergunta */}
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-text-high-contrast sm:text-xl">
                  {currentQuestion.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-blueprint-gray">
                  &gt; {currentQuestion.subtitle}
                </p>
              </div>

              {/* Opções de Resposta */}
              <div className="grid gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentStep] === option.points;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(option.points)}
                      className={`group flex w-full flex-col text-left border p-4 transition-all ${
                        isSelected
                          ? "border-vibrant-cyan bg-surface-navy shadow-cyan-glow"
                          : "border-vibrant-cyan/20 bg-surface-navy/70 hover:border-vibrant-cyan/60 hover:bg-surface-navy"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-bold text-text-high-contrast group-hover:text-vibrant-cyan transition-colors">
                          {option.label}
                        </span>
                        <span className="font-mono text-[11px] text-vibrant-cyan/70">
                          {isSelected ? "● SELECIONADO" : "○ SELECIONAR"}
                        </span>
                      </div>
                      <p className="mt-1.5 font-mono text-xs leading-relaxed text-blueprint-gray">
                        {option.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Navegação Inferior */}
              <div className="mt-6 flex items-center justify-between border-t border-vibrant-cyan/20 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-blueprint-gray hover:text-vibrant-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &lt; VOLTAR
                </button>
                <span className="font-mono text-[11px] text-blueprint-gray">
                  Selecione uma opção para avançar automaticamente
                </span>
              </div>
            </div>
          ) : (
            /* Scorecard & Formulário de Conversão */
            <div className="border border-vibrant-cyan/40 bg-surface-panel p-6 shadow-cyan-glow sm:p-8">
              {/* Cabeçalho do Resultado */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-vibrant-cyan/20 pb-4 mb-6 gap-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-vibrant-cyan uppercase tracking-widest">
                    // DIAGNÓSTICO PRELIMINAR CONCLUÍDO
                  </span>
                  <h3 className="font-heading text-xl font-bold text-text-high-contrast mt-0.5">
                    {diagnosis.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="border border-vibrant-cyan/40 bg-surface-navy px-4 py-2 text-center shadow-cyan-glow">
                    <span className="block font-mono text-[10px] text-blueprint-gray">ÍNDICE BUNKER</span>
                    <span className="font-mono text-2xl font-bold text-vibrant-cyan">{score}</span>
                    <span className="font-mono text-xs text-blueprint-gray">/100</span>
                  </div>
                </div>
              </div>

              {/* Badge de Classificação */}
              <div className="mb-4">
                <span
                  className={`inline-block border px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                    diagnosis.tier === "critical"
                      ? "border-secondary/60 bg-secondary/10 text-secondary shadow-orange-glow"
                      : diagnosis.tier === "warning"
                      ? "border-vibrant-cyan/60 bg-vibrant-cyan/10 text-vibrant-cyan shadow-cyan-glow"
                      : "border-tertiary/60 bg-tertiary/10 text-tertiary shadow-green-glow"
                  }`}
                >
                  {diagnosis.badge}
                </span>
              </div>

              {/* Parecer do Diagnóstico */}
              <div className="grid gap-3 font-mono text-xs leading-relaxed text-blueprint-gray">
                <p className="text-text-high-contrast">{diagnosis.description}</p>
                <div className="border-l-2 border-vibrant-cyan bg-surface-navy/80 p-3">
                  <strong className="text-vibrant-cyan">Vulnerabilidades Identificadas:</strong> {diagnosis.riskSummary}
                </div>
                <div className="border-l-2 border-tertiary bg-surface-navy/80 p-3">
                  <strong className="text-tertiary">Ação Recomendada:</strong> {diagnosis.recommendation}
                </div>
              </div>

              {/* Formulário de Envio do Diagnóstico */}
              {!isSubmitted ? (
                <div className="mt-8 border-t border-vibrant-cyan/20 pt-6">
                  <div className="mb-4">
                    <h4 className="font-heading text-base font-bold text-text-high-contrast">
                      Receba o Relatório Completo no seu E-mail
                    </h4>
                    <p className="font-mono text-xs text-blueprint-gray">
                      Enviaremos o checklist de adequação à ISO 27001 / ISO 42001 e convidaremos você para uma sessão estratégica de 30 minutos com nosso Arquiteto Forward Deployed.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitLead} className="grid gap-4 sm:grid-cols-3">
                    <label className="grid gap-1 font-mono text-xs text-blueprint-gray">
                      Nome Completo *
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Carlos Mendes"
                        className="min-h-11 border border-vibrant-cyan/30 bg-surface-navy px-3 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                      />
                    </label>

                    <label className="grid gap-1 font-mono text-xs text-blueprint-gray">
                      E-mail Corporativo *
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="carlos@suaempresa.com.br"
                        className="min-h-11 border border-vibrant-cyan/30 bg-surface-navy px-3 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                      />
                    </label>

                    <label className="grid gap-1 font-mono text-xs text-blueprint-gray">
                      WhatsApp com DDD *
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="min-h-11 border border-vibrant-cyan/30 bg-surface-navy px-3 font-mono text-xs text-text-high-contrast focus:border-vibrant-cyan focus:outline-none focus:shadow-cyan-glow transition-all"
                      />
                    </label>

                    {errorMessage && (
                      <p className="font-mono text-xs text-secondary sm:col-span-3">{errorMessage}</p>
                    )}

                    <div className="sm:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-chamfer w-full sm:w-auto inline-flex min-h-11 items-center justify-center bg-vibrant-cyan px-6 font-mono text-xs font-bold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white hover:shadow-cyan-glow-lg disabled:opacity-50 transition-all"
                      >
                        {isSubmitting ? "ENVIANDO DIAGNÓSTICO..." : "ENVIAR DIAGNÓSTICO COMPLETO ↗"}
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="font-mono text-xs text-blueprint-gray hover:text-vibrant-cyan underline transition-colors"
                      >
                        Refazer o teste
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Confirmação de Envio com Sucesso */
                <div className="mt-8 border border-tertiary/40 bg-surface-navy p-6 text-center shadow-green-glow">
                  <span className="font-mono text-xs font-bold text-tertiary uppercase tracking-widest block mb-2">
                    ✓ DIAGNÓSTICO ENVIADO COM SUCESSO
                  </span>
                  <h4 className="font-heading text-lg font-bold text-text-high-contrast mb-2">
                    Verifique sua caixa de entrada em instantes!
                  </h4>
                  <p className="font-mono text-xs leading-relaxed text-blueprint-gray max-w-xl mx-auto mb-6">
                    O relatório preliminar com os controles recomendados para o seu <strong>Índice Bunker ({score}/100)</strong> foi encaminhado para <strong>{formData.email}</strong>. Nossa equipe técnica também recebeu sua notificação.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="#contato"
                      className="btn-chamfer inline-flex min-h-11 items-center justify-center bg-vibrant-cyan px-6 font-mono text-xs font-bold uppercase tracking-wider text-surface-navy shadow-cyan-glow hover:bg-white transition-all"
                    >
                      Agendar Call com o Arquiteto Agora ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="border border-vibrant-cyan/30 px-4 py-2.5 font-mono text-xs text-blueprint-gray hover:border-vibrant-cyan hover:text-vibrant-cyan transition-all"
                    >
                      Refazer Diagnóstico
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
