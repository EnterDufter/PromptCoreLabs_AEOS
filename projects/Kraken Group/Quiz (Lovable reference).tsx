import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";

type Option = { key: string; label: string; points: number };
type Question = { id: keyof QuizAnswers; title: string; subtitle: string; options: Option[] };

type QuizAnswers = {
  q1_business_profile: string;
  q2_financial_impact: string;
  q3_conflict_management: string;
  q4_expansion_validation: string;
};

const QUESTIONS: Question[] = [
  {
    id: "q1_business_profile",
    title: "Qual o perfil da sua operação atual?",
    subtitle: "Nos conte de onde vem sua receita principal hoje.",
    options: [
      { key: "A", label: "Clínica ou empresa própria", points: 2 },
      { key: "B", label: "Rede de franquia — sou franqueador", points: 3 },
      { key: "C", label: "Rede de franquia — sou franqueado", points: 3 },
      { key: "D", label: "Grupo empresarial ou sócio investidor", points: 2 },
    ],
  },
  {
    id: "q2_financial_impact",
    title: "Como estão seus contratos bancários e custo financeiro?",
    subtitle: "Impacto real sobre a margem operacional.",
    options: [
      { key: "A", label: "Crítico — consome mais de 25% da margem", points: 5 },
      { key: "B", label: "Moderado — pagamos, mas tira o fôlego", points: 3 },
      { key: "C", label: "Baixo ou nulo — sob controle", points: 0 },
    ],
  },
  {
    id: "q3_conflict_management",
    title: "Como sua empresa gerencia conflitos e relações societárias?",
    subtitle: "Franqueados, sócios, fornecedores estratégicos.",
    options: [
      { key: "A", label: "Na base do desgaste ou com ameaça judicial", points: 5 },
      { key: "B", label: "Informalmente, com pontas soltas", points: 3 },
      { key: "C", label: "Estruturadamente — conselho ou mediação", points: 0 },
    ],
  },
  {
    id: "q4_expansion_validation",
    title: "Como você valida novas expansões ou aberturas?",
    subtitle: "Novas unidades, sócios ou linhas de negócio.",
    options: [
      { key: "A", label: "Feeling e intuição de mercado", points: 5 },
      { key: "B", label: "Planejamento interno, sem validação externa", points: 3 },
      { key: "C", label: "Auditoria e estudo 360° prévio", points: 0 },
    ],
  },
];

function classify(score: number) {
  if (score <= 5)
    return {
      level: "BAIXO" as const,
      title: "Risco Baixo — Prevenção",
      text: "Sua operação apresenta boa estrutura, mas requer monitoramento de governança para sustentabilidade de longo prazo.",
      Icon: CheckCircle2,
    };
  if (score <= 11)
    return {
      level: "MEDIO" as const,
      title: "Risco Médio — Vulnerabilidade Operacional",
      text: "Sua empresa possui gargalos silenciosos em contratos ou gestão que podem estar limitando sua margem e expansão.",
      Icon: AlertTriangle,
    };
  return {
    level: "ALTO" as const,
    title: "Risco Alto — Vulnerabilidade Crítica",
    text: "ATENÇÃO: alto nível de exposição a sangrias financeiras e desgastes contratuais. Intervenção técnica necessária para estancar perdas.",
    Icon: ShieldAlert,
  };
}

export function Quiz() {
  const [step, setStep] = useState(0); // 0..3 questions, 4 result, 5 form, 6 success
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [scoreMap, setScoreMap] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone_whatsapp: "",
    main_bottleneck_notes: "",
    consent: false,
  });

  const total = QUESTIONS.length;
  const progress = step < total ? (step / total) * 100 : 100;
  const totalScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const result = classify(totalScore);

  function selectAnswer(q: Question, opt: Option) {
    setAnswers((a) => ({ ...a, [q.id]: opt.key }));
    setScoreMap((s) => ({ ...s, [q.id]: opt.points }));
    setTimeout(() => setStep((s) => s + 1), 220);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) return;
    setSubmitting(true);
    const payload = {
      entity: "Lead_Kraken_Group",
      created_at: new Date().toISOString(),
      lead_source: "Landing Page Kraken Group (Lovable)",
      contact_info: {
        full_name: form.full_name,
        company_name: form.company_name,
        email: form.email,
        phone_whatsapp: form.phone_whatsapp,
        main_bottleneck_notes: form.main_bottleneck_notes,
      },
      quiz_responses: answers,
      assessment_result: {
        total_risk_score: totalScore,
        risk_classification: result.level,
        diagnostic_status_text: result.text,
      },
      meta_data: {
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };
    // Persist locally until webhook/Supabase é conectado
    try {
      const key = "kraken_leads";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push(payload);
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {}
    console.log("[Kraken lead]", payload);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setStep(6);
  }

  return (
    <div id="diagnostico" className="scroll-mt-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-10">
        {/* Progress */}
        {step < 5 && (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
              <span>Diagnóstico Kraken</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-gradient-to-r from-gold-muted to-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {step < total && (
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Pergunta {step + 1} de {total}
            </p>
            <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">{QUESTIONS[step].title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{QUESTIONS[step].subtitle}</p>

            <div className="mt-8 grid gap-3">
              {QUESTIONS[step].options.map((opt) => {
                const selected = answers[QUESTIONS[step].id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => selectAnswer(QUESTIONS[step], opt)}
                    className={`group flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all sm:p-5 ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </button>
                );
              })}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
            )}
          </div>
        )}

        {step === total && (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
              <result.Icon className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-widest text-primary">Diagnóstico Preliminar</p>
            <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">{result.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pontuação de risco: <span className="font-semibold text-foreground">{totalScore} / 18</span>
            </p>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/90">{result.text}</p>
            <button
              onClick={() => setStep(5)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Liberar relatório completo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 5 && (
          <form onSubmit={submit} className="grid gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Etapa final</p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Receba seu relatório e diagnóstico executivo</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Informações usadas exclusivamente para contato da equipe Kraken Group.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
              <Field label="Empresa" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} required />
              <Field type="email" label="E-mail corporativo" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <Field label="WhatsApp (com DDD)" value={form.phone_whatsapp} onChange={(v) => setForm({ ...form, phone_whatsapp: v })} required />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Descreva seu principal gargalo
              </label>
              <textarea
                required
                rows={4}
                value={form.main_bottleneck_notes}
                onChange={(e) => setForm({ ...form, main_bottleneck_notes: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Ex.: contratos bancários corroendo margem, conflito com franqueados, dúvida na expansão..."
              />
            </div>

            <label className="flex items-start gap-3 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-border bg-background accent-[color:var(--gold)]"
              />
              <span>
                Autorizo o contato da Kraken Group e concordo com o tratamento dos dados conforme a LGPD e a Política de Privacidade.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || !form.consent}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? "Enviando..." : "Receber diagnóstico executivo"}
            </button>
          </form>
        )}

        {step === 6 && (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-6 text-3xl font-semibold">Diagnóstico enviado</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Nossa equipe recebeu suas respostas e entrará em contato em até 24h úteis pelo WhatsApp informado com o relatório completo e a agenda de conversa executiva.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}
