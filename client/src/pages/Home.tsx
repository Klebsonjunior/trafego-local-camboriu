import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, Check, MessageCircle, Target, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-3" aria-label="Kriaat Hub">
      <svg width="34" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 4c-6.6 0-12 5.2-12 11.6 0 4.2 2.3 7 4.4 9 1.3 1.3 2 2.7 2 4.4v2h11.2v-2c0-1.7.7-3.1 2-4.4 2.1-2 4.4-4.8 4.4-9C32 9.2 26.6 4 20 4z" stroke="#FFB000" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M15.5 34h9M16.5 37h7M17 22c-1-1-1.6-2-1.6-3.4 0-2.4 2-4.3 4.6-4.3M20 1v3M11 5l1.8 2.2M29 5l-1.8 2.2" stroke="#FFB000" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="brand-wordmark flex items-center gap-1.5 text-[1.45rem] leading-none text-[#F7F6FA]"><span>kriaat</span><span className="h-4 w-px bg-[#B38CFF]/70" /><span className="font-semibold text-[#B38CFF]">hub</span></span>
    </a>
  );
}

type LeadData = { name: string; phone: string; business: string; objective: string; situation: string };
const initialLead: LeadData = { name: "", phone: "", business: "", objective: "", situation: "" };

function LeadChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState<LeadData>(initialLead);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const submitLead = trpc.leads.create.useMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const questions = [
    { key: "name", label: "Como podemos chamar você?", placeholder: "Seu nome", type: "input" },
    { key: "phone", label: "Qual é o seu WhatsApp?", placeholder: "(47) 99999-9999", type: "tel" },
    { key: "business", label: "Qual é o nome do seu negócio?", placeholder: "Ex.: clínica, loja, escritório...", type: "input" },
    { key: "objective", label: "O que você mais quer gerar hoje?", placeholder: "Escolha uma opção", type: "options", options: ["Mais conversas no WhatsApp", "Pedidos de orçamento", "Agendamentos", "Mais oportunidades comerciais"] },
    { key: "situation", label: "Como está sua aquisição hoje?", placeholder: "Escolha uma opção", type: "options", options: ["Ainda não anuncio", "Já anuncio e quero melhorar", "Anuncio, mas não sei o que funciona", "Parei de anunciar e quero voltar"] },
  ] as const;
  const current = questions[step];

  useEffect(() => {
    if (!open) return;
    setStep(0); setLead(initialLead); setInput(""); setSubmitted(false); setSubmitError(""); setConsentAccepted(false); submitLead.reset();
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", escape); };
  }, [open, onClose]);

  if (!open) return null;

  const advance = async (value: string) => {
    if (submitLead.isPending) return;
    if (step === questions.length - 1 && !consentAccepted) return;
    const nextLead = { ...lead, [current.key]: value } as LeadData;
    setLead(nextLead); setInput(""); setSubmitError("");
    if (step === questions.length - 1) {
      try {
        const params = new URLSearchParams(window.location.search);
        await submitLead.mutateAsync({
          name: nextLead.name,
          phone: nextLead.phone,
          business: nextLead.business,
          city: "",
          invests: nextLead.situation,
          objective: nextLead.objective,
          budget: "A definir no diagnóstico",
          source: "kriaat-trafego-pago",
          page: window.location.pathname,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
          utmContent: params.get("utm_content") ?? undefined,
          consent: true,
          createdAt: new Date().toISOString(),
        });
        setSubmitted(true);
      } catch { setSubmitError("Não conseguimos enviar agora. Confira os dados e tente novamente."); }
    } else {
      setStep((value) => value + 1);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const submitInput = (event: FormEvent) => { event.preventDefault(); if (input.trim()) void advance(input.trim()); };

  return (
    <div className="chat-backdrop" role="dialog" aria-modal="true" aria-labelledby="chat-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="chat-modal">
        <header className="chat-header"><div className="chat-avatar"><MessageCircle size={18} /></div><div className="min-w-0 flex-1"><p id="chat-title">Kriaat Hub</p><span>Diagnóstico rápido do seu momento</span></div><button className="chat-close" onClick={onClose} aria-label="Fechar formulário"><X size={19} /></button></header>
        <div className="chat-body">
          {submitted ? <div className="chat-success"><div className="success-icon"><Check size={23} /></div><p className="eyebrow text-[#17B26A]">Recebemos seus dados</p><h2 className="display mt-3 text-2xl font-semibold">Obrigado, {lead.name.split(" ")[0]}.</h2><p className="mt-3 text-sm leading-6 text-[#14052B]/65">Vamos analisar seu momento e entrar em contato para entender o melhor caminho.</p><button className="button-dark mt-6" onClick={onClose}>Voltar para a página <ArrowRight size={16} /></button></div> : <>
            <div className="chat-intro"><span className="chat-bubble">Vamos entender onde sua empresa pode melhorar a geração de oportunidades.</span><small>Leva menos de um minuto</small></div>
            <div className="chat-progress"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
            <div className="chat-question"><p className="eyebrow text-[#14052B]/45">Pergunta {step + 1} de {questions.length}</p><h2 className="display mt-2 text-[1.42rem] font-semibold leading-tight">{current.label}</h2></div>
            {current.type === "options" ? <><div className="chat-options">{current.options?.map((option) => <button key={option} onClick={() => advance(option)} disabled={submitLead.isPending || (step === questions.length - 1 && !consentAccepted)}>{submitLead.isPending && step === questions.length - 1 ? "Enviando..." : option}<ArrowRight size={15} /></button>)}</div>{step === questions.length - 1 && <label className="consent-row"><input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} /><span>Autorizo a Kriaat a usar estes dados para entrar em contato.</span></label>}</> : <form className="chat-form" onSubmit={submitInput}><input ref={inputRef} required type={current.type === "tel" ? "tel" : "text"} value={input} onChange={(event) => setInput(event.target.value)} placeholder={current.placeholder} aria-label={current.label} /><button type="submit" aria-label="Enviar resposta"><ArrowRight size={17} /></button></form>}
            {submitError && <p className="chat-error" role="alert">{submitError}</p>}<p className="chat-privacy">Seus dados serão usados somente para entrarmos em contato.</p>
          </>}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const openChat = () => setChatOpen(true);
  return (
    <div id="inicio" className="min-h-screen bg-[#14052B] text-[#F7F6FA]">
      <header className="site-header"><div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8"><Logo /><button className="header-cta hidden sm:inline-flex" onClick={openChat}>Quero gerar oportunidades <ArrowRight size={15} /></button></div></header>
      <main className="simple-landing">
        <section className="hero"><div className="hero-glow" /><div className="mx-auto grid max-w-[1120px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-24"><div className="relative"><p className="eyebrow text-[#FFB000]">Aquisição de clientes para empresas</p><h1 className="display mt-5 max-w-[760px] text-[clamp(2.45rem,5.6vw,5.2rem)] font-semibold leading-[.96] tracking-[-.07em]">Sua empresa não precisa de mais cliques.<br /><span className="text-[#B38CFF]">Precisa de oportunidades.</span></h1><p className="mt-6 max-w-[610px] text-[1rem] leading-7 text-[#F7F6FA]/72">Planejamos e gerenciamos anúncios para colocar sua empresa diante de pessoas com potencial real de comprar — com clareza sobre o que está funcionando depois do clique.</p><button className="button-primary mt-8" onClick={openChat}>Quero gerar oportunidades <ArrowRight size={17} /></button><p className="hero-note mt-5">Meta Ads · Google Ads · Estratégia · Otimização</p></div><div className="hero-offer relative"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#FFB000]">O que analisamos</p><h2 className="display mt-3 text-2xl font-semibold leading-tight">O caminho inteiro até a oportunidade comercial.</h2></div><Target className="mt-1 shrink-0 text-[#FFB000]" size={28} /></div><div className="mini-list"><div><span>01</span><p><b>Oferta e mensagem</b><small>O que sua empresa está apresentando.</small></p></div><div><span>02</span><p><b>Canal e campanha</b><small>Onde e para quem o anúncio aparece.</small></p></div><div><span>03</span><p><b>Conversão e atendimento</b><small>O que acontece depois do contato.</small></p></div></div></div></div></section>
        <section className="section-light"><div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20"><div className="grid gap-7 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><div><p className="eyebrow text-[#14052B]/55">O problema</p><h2 className="display mt-4 max-w-[500px] text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.02] tracking-[-.065em]">Anunciar não deveria ser uma sequência de tentativas.</h2></div><div><p className="max-w-[580px] text-[1rem] leading-7 text-[#14052B]/68">Você pode estar recebendo cliques, mas ainda não saber se o problema está no público, no anúncio, na oferta, na página ou no atendimento.</p><p className="mt-5 max-w-[580px] text-[1rem] leading-7 text-[#14052B]/68">Por isso, não olhamos apenas para o gerenciador de anúncios. Conectamos cada parte para encontrar o gargalo que está impedindo o investimento de virar conversa, orçamento ou agendamento.</p><button className="text-link mt-7" onClick={openChat}>Ver se faz sentido para o meu negócio <ArrowRight size={15} /></button></div></div><div className="mt-12 grid border-y border-[#14052B]/15 md:grid-cols-3"><div className="benefit border-b-0"><BarChart3 className="text-[#0B7D46]" size={22} /><h3>Mais clareza</h3><p>Entenda onde o orçamento está sendo usado e o que precisa ser ajustado.</p></div><div className="benefit border-b-0"><Target className="text-[#0B7D46]" size={22} /><h3>Estratégia adequada</h3><p>Meta, Google ou os dois: a escolha depende de como seu cliente compra.</p></div><div className="benefit border-b-0"><MessageCircle className="text-[#0B7D46]" size={22} /><h3>Foco comercial</h3><p>Cliques importam, mas o objetivo é aproximar mídia das oportunidades reais.</p></div></div></div></section>
        <section className="section-dark"><div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20"><div className="grid gap-7 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><div><p className="eyebrow text-[#FFB000]">Como trabalhamos</p><h2 className="display mt-4 max-w-[500px] text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.02] tracking-[-.065em]">Gestão de tráfego com começo, meio e acompanhamento.</h2></div><p className="max-w-[580px] text-[1rem] leading-7 text-[#F7F6FA]/68">Começamos entendendo o negócio e o objetivo. Depois definimos a estrutura mais adequada, colocamos as campanhas no ar e usamos os dados para otimizar as próximas decisões.</p></div><div className="mt-12 grid border-y border-[#F7F6FA]/15 md:grid-cols-4"><div className="py-6 pr-5 md:border-r md:border-[#F7F6FA]/15"><span className="eyebrow text-[#FFB000]">01</span><h3 className="display mt-3 text-lg font-semibold">Diagnóstico</h3><p className="mt-2 text-sm leading-6 text-[#F7F6FA]/58">Negócio, oferta, público e objetivo.</p></div><div className="py-6 pr-5 md:px-5 md:border-r md:border-[#F7F6FA]/15"><span className="eyebrow text-[#FFB000]">02</span><h3 className="display mt-3 text-lg font-semibold">Estratégia</h3><p className="mt-2 text-sm leading-6 text-[#F7F6FA]/58">Canal, mensagem e destino do contato.</p></div><div className="py-6 pr-5 md:px-5 md:border-r md:border-[#F7F6FA]/15"><span className="eyebrow text-[#FFB000]">03</span><h3 className="display mt-3 text-lg font-semibold">Implementação</h3><p className="mt-2 text-sm leading-6 text-[#F7F6FA]/58">Campanhas, públicos e rastreamento.</p></div><div className="py-6 md:pl-5"><span className="eyebrow text-[#FFB000]">04</span><h3 className="display mt-3 text-lg font-semibold">Otimização</h3><p className="mt-2 text-sm leading-6 text-[#F7F6FA]/58">Testes, ajustes e leitura comercial.</p></div></div><div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-l-2 border-[#FFB000] pl-5"><p className="text-sm leading-6 text-[#F7F6FA]/76">Criativos, landing page, site e Perfil da Empresa no Google podem entrar quando resolverem um gargalo real.</p><span className="eyebrow text-[#FFB000]">Sem empurrar pacote</span></div></div></section>
        <section className="final-cta"><div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20"><div className="final-box"><MessageCircle className="text-[#FFB000]" size={28} /><p className="eyebrow mt-6 text-[#14052B]/55">Próximo passo</p><h2 className="display mt-4 max-w-[760px] text-[clamp(2.15rem,4.5vw,4rem)] font-semibold leading-[.98] tracking-[-.065em]">Descubra o que está impedindo seus anúncios de gerar mais oportunidades.</h2><p className="mt-5 max-w-[620px] leading-7 text-[#14052B]/68">Responda cinco perguntas rápidas sobre sua empresa. A partir disso, entendemos seu momento e conversamos sobre o caminho mais adequado.</p><button className="button-dark mt-7" onClick={openChat}>Quero avaliar meu negócio <ArrowRight size={17} /></button><p className="mt-4 text-xs text-[#14052B]/52">A conversa é breve. A verba de anúncios é separada da gestão.</p></div></div></section>
      </main>
      <footer className="footer"><div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Logo /><p className="text-xs">Estratégia de aquisição para empresas.</p></div></footer>
      <LeadChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
