/* Kriaat Hub — mesma identidade visual do site original; landing curta, objetiva e orientada a leads de tráfego pago. */
import { FormEvent, useState } from "react";
import { ArrowRight, Check, ChevronDown, MessageCircle, Target, X } from "lucide-react";

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-3" aria-label="Kriaat Hub">
      <svg width="36" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 4c-6.6 0-12 5.2-12 11.6 0 4.2 2.3 7 4.4 9 1.3 1.3 2 2.7 2 4.4v2h11.2v-2c0-1.7.7-3.1 2-4.4 2.1-2 4.4-4.8 4.4-9C32 9.2 26.6 4 20 4z" stroke="#FFB000" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M15.5 34h9M16.5 37h7" stroke="#FFB000" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M17 22c-1-1-1.6-2-1.6-3.4 0-2.4 2-4.3 4.6-4.3" stroke="#FFB000" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 1v3M11 5l1.8 2.2M29 5l-1.8 2.2" stroke="#FFB000" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="brand-wordmark flex items-center gap-1.5 text-[1.55rem] leading-none text-[#F7F6FA]"><span>kriaat</span><span className="h-4 w-px bg-[#B38CFF]/70" /><span className="font-semibold text-[#B38CFF]">hub</span></span>
    </a>
  );
}

const benefits = [
  ["Campanhas com objetivo", "Anúncios pensados para gerar conversas, agendamentos e oportunidades reais."],
  ["Foco na sua região", "Estratégia para alcançar pessoas próximas do seu negócio em Camboriú e região."],
  ["Acompanhamento contínuo", "Leitura dos dados e otimizações para sua verba trabalhar com mais direção."],
];

const faqs = [
  ["A verba dos anúncios está incluída?", "Não. A verba de mídia é paga diretamente à Meta ou ao Google. A mensalidade é o valor da gestão."],
  ["Vocês atendem quais cidades?", "Atendemos negócios de Camboriú, Balneário Camboriú e região. Avaliamos sua área no diagnóstico."],
  ["Vocês garantem vendas?", "Não prometemos um número fixo de vendas. Criamos e acompanhamos uma operação de mídia com objetivos e leitura de dados."],
  ["Preciso ter criativos prontos?", "Depende do plano. Podemos trabalhar com materiais fornecidos pela empresa ou incluir a criação como parte da proposta."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return <div id="inicio" className="min-h-screen bg-[#14052B] text-[#F7F6FA]">
    <header className="site-header"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8"><Logo /><nav className={menuOpen ? "nav-open" : "nav-closed"}><a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a><a href="#duvidas" onClick={() => setMenuOpen(false)}>Dúvidas</a><a href="#formulario" onClick={() => setMenuOpen(false)} className="header-cta">Quero anunciar <ArrowRight size={15} /></a></nav><button className="menu-toggle lg:hidden" aria-label="Abrir menu" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={21} /> : <span className="menu-lines" />}</button></div></header>
    <main>
      <section className="hero"><div className="hero-glow" /><div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20 lg:py-28"><div className="relative"><p className="eyebrow text-[#FFB000]">Tráfego pago para negócios locais</p><h1 className="display mt-5 max-w-[680px] text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[.98] tracking-[-.07em]">Mais pessoas certas chegando até o seu negócio<span className="text-[#FFB000]">.</span></h1><p className="mt-7 max-w-[560px] text-[1.03rem] leading-7 text-[#F7F6FA]/65">Criamos e gerenciamos campanhas no Instagram, Facebook e Google para gerar mais contatos, agendamentos e clientes em Camboriú e região.</p><div className="mt-8 flex flex-wrap items-center gap-4"><a className="button-primary" href="#formulario">Quero atrair mais clientes <ArrowRight size={17} /></a><span className="hero-note">Camboriú · Balneário Camboriú · região</span></div></div><div id="formulario" className="lead-card"><div className="lead-card-top"><div className="icon-box"><Target size={20} /></div><div><p className="eyebrow text-[#FFB000]">Diagnóstico inicial</p><h2 className="display mt-2 text-[1.45rem] font-semibold leading-tight">Vamos entender o momento do seu negócio.</h2></div></div>{submitted ? <div className="success-state"><div className="success-icon"><Check size={24} /></div><h3 className="display mt-4 text-2xl font-semibold">Recebemos seu interesse.</h3><p className="mt-3 text-sm leading-6 text-[#F7F6FA]/62">Agora podemos conversar sobre seu objetivo, sua região e o melhor caminho para começar.</p><button className="text-link mt-5" onClick={() => setSubmitted(false)}>Enviar outro briefing <ArrowRight size={15} /></button></div> : <form onSubmit={submit} className="mt-7 space-y-3"><label>Seu nome<input required placeholder="Como podemos chamar você?" /></label><label>Nome do negócio<input required placeholder="Ex.: clínica, loja, restaurante..." /></label><label>WhatsApp<input required type="tel" placeholder="(47) 99999-9999" /></label><label>O que você quer melhorar?<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Receber mais conversas</option><option>Gerar agendamentos</option><option>Atrair mais visitas</option><option>Vender um serviço específico</option></select></label><button className="button-primary w-full" type="submit">Quero falar sobre tráfego pago <ArrowRight size={17} /></button><p className="form-disclaimer">Sem compromisso. A primeira conversa é para entender se faz sentido para o seu negócio.</p></form>}</div></div><div className="mx-auto max-w-[1180px] border-t border-[#F7F6FA]/12 px-5 py-4 sm:px-8"><div className="flex flex-wrap justify-between gap-3 text-xs font-semibold text-[#F7F6FA]/45"><span>Estratégia clara.</span><span>Campanhas acompanhadas.</span><span className="text-[#FFB000]">Foco em oportunidades locais.</span></div></div></section>
      <section id="como-funciona" className="section-light"><div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow text-[#14052B]/55">Como funciona</p><h2 className="display mt-4 max-w-[470px] text-[clamp(2.25rem,4.5vw,4.2rem)] font-semibold leading-[1.02] tracking-[-.07em]">Você cuida do negócio. A gente cuida dos anúncios.</h2></div><p className="max-w-[450px] leading-7 text-[#14052B]/62">Tráfego pago não é apenas colocar uma campanha no ar. É definir um objetivo, encontrar o público certo e acompanhar o que acontece depois do clique.</p></div><div className="mt-12 grid border-y border-[#14052B]/15 md:grid-cols-3">{benefits.map(([title,text], index) => <article className="benefit" key={title}><span className="eyebrow text-[#FFB000]">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="proof-strip"><div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="eyebrow text-[#FFB000]">A mídia precisa fazer sentido</p><h2 className="display mt-4 max-w-[740px] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-.06em]">Mais clareza para decidir onde sua verba deve estar.</h2></div><a className="button-primary" href="#formulario">Quero um diagnóstico <ArrowRight size={17} /></a></div></section>
      <section id="duvidas" className="section-dark"><div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.78fr_1.22fr] lg:gap-20"><div><p className="eyebrow text-[#FFB000]">Antes de começar</p><h2 className="display mt-4 max-w-[430px] text-[clamp(2.1rem,4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-.07em]">O que você precisa saber.</h2></div><div className="faq-list">{faqs.map(([question,answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="final-cta"><div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24"><div className="final-box"><MessageCircle className="text-[#FFB000]" size={28} /><p className="eyebrow mt-6 text-[#14052B]/55">Próximo passo</p><h2 className="display mt-4 max-w-[800px] text-[clamp(2.4rem,5vw,4.8rem)] font-semibold leading-[.98] tracking-[-.07em]">Seu negócio já existe. Agora faça mais pessoas encontrarem você.</h2><a className="button-dark mt-8" href="#formulario">Quero atrair mais clientes <ArrowRight size={17} /></a></div></div></section>
    </main>
    <footer className="footer"><div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Logo /><p className="mono text-xs uppercase tracking-[.12em] text-[#F7F6FA]/42">Estrutura de produtos e crescimento local.</p></div></footer>
  </div>;
}
