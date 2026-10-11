import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { CONVERGENCIAS } from '@/data/disciplinas';
import { FATORES, EVIDENCIA_CORES } from '@/data/fatores';
import { CASOS } from '@/data/casos';

const HERO_IMG = 'https://images.hostinger.com/070c6260-dfbb-4a33-9c0b-1a5b62c001ba.png';
const FLOW = ['Pessoas', 'Comportamentos', 'Relações', 'Processos', 'Indicadores', 'Valor empresarial'];

const Equation = () => {
    const [active, setActive] = useState(null);
    const parts = [
        { id: 'psi', label: 'Psicometria', hint: 'A ciência de medir características humanas com rigor: validade, confiabilidade, equidade.' },
        { id: 'eco', label: 'Econometria', hint: 'Métodos quantitativos para analisar dados econômicos: incerteza, causalidade, previsão.' },
        { id: 'psico', label: 'Psiconometria', hint: 'A proposta integrada: investigar como fatores humanos influenciam processos e resultados empresariais.' },
    ];
    return (
        <div>
            <div className="flex flex-wrap items-stretch gap-2 md:gap-3" role="group" aria-label="Equação Psiconometria">
                {parts.map((p, i) => (
                    <React.Fragment key={p.id}>
                        {i === 1 && <span className="self-center text-2xl font-light text-graphite/50">+</span>}
                        {i === 2 && <span className="self-center text-2xl font-light text-graphite/50">=</span>}
                        <button
                            onMouseEnter={() => setActive(p.id)}
                            onFocus={() => setActive(p.id)}
                            onMouseLeave={() => setActive(null)}
                            onBlur={() => setActive(null)}
                            onClick={() => setActive(active === p.id ? null : p.id)}
                            className={`border px-4 py-3 text-sm font-black uppercase tracking-tight transition-colors md:px-6 md:py-4 md:text-xl ${
                                p.id === 'psico'
                                    ? 'border-petrol bg-petrol text-ivory'
                                    : active === p.id
                                      ? 'border-graphite bg-graphite text-ivory'
                                      : 'border-graphite/30 bg-transparent text-graphite hover:border-graphite'
                            }`}
                        >
                            {p.label}
                        </button>
                    </React.Fragment>
                ))}
            </div>
            <p className="mt-3 min-h-10 max-w-xl text-sm leading-relaxed text-graphite/70" aria-live="polite">
                {active ? parts.find((p) => p.id === active).hint : 'Passe o cursor ou toque em cada termo da equação.'}
            </p>
        </div>
    );
};

const FlowStrip = () => (
    <div className="relative border-y border-graphite/15 py-6">
        <div className="relative mx-auto max-w-[90rem] px-5 md:px-10">
            <div className="relative flex items-center justify-between gap-1">
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-graphite/20" aria-hidden="true" />
                <span className="flow-dot absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber" aria-hidden="true" />
                {FLOW.map((step, i) => (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full border ${i === FLOW.length - 1 ? 'border-amber bg-amber' : 'border-graphite bg-ivory'}`} />
                        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-graphite/70 sm:block md:text-[11px]">
                            {step}
                        </span>
                    </div>
                ))}
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-graphite/50 sm:hidden">
                Pessoas → Comportamentos → Relações → Processos → Indicadores → Valor empresarial
            </p>
        </div>
    </div>
);

const MiniMatriz = () => {
    const demo = FATORES.filter((f) => ['seguranca-psicologica', 'lideranca', 'aprendizado'].includes(f.id));
    const [sel, setSel] = useState(demo[0].id);
    const fator = demo.find((f) => f.id === sel);
    return (
        <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite/60">Escolha um fator humano</p>
                <div className="mt-4 flex flex-col">
                    {demo.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setSel(f.id)}
                            className={`border-t border-graphite/15 py-3 text-left text-sm font-semibold transition-colors ${
                                sel === f.id ? 'text-petrol' : 'text-graphite/70 hover:text-graphite'
                            }`}
                        >
                            {f.nome}
                        </button>
                    ))}
                </div>
                <Link to="/matriz" className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-petrol hover:underline">
                    Ver os 16 fatores <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
            </div>
            <div className="md:col-span-8">
                <div className="flex items-center gap-3">
                    <p className="font-serif text-2xl italic text-graphite">{fator.nome}</p>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${EVIDENCIA_CORES[fator.evidencia]}`}>
                        Evidência {fator.evidencia.toLowerCase()}
                    </span>
                </div>
                <ol className="mt-5 space-y-0">
                    {fator.cadeia.map((step, i) => (
                        <li key={i} className="relative border-l border-graphite/25 pb-4 pl-5 text-sm leading-relaxed text-graphite/80">
                            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-petrol bg-ivory" aria-hidden="true" />
                            <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-graphite/50">
                                {['Comportamento', 'Efeito no processo', 'Indicador antecedente', 'KPI operacional', 'KPI financeiro'][i]}
                            </span>
                            <br />
                            {step}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

const HomePage = () => {
    const destaque = CASOS.find((c) => c.id === 'gallup-q12');
    return (
        <>
            <Helmet>
                <title>Psiconometria | Pessoas, dados e resultados empresariais</title>
                <meta
                    name="description"
                    content="Conheça a Psiconometria, abordagem que conecta psicometria e econometria para investigar como fatores humanos influenciam processos, produtividade e resultados empresariais."
                />
            </Helmet>

            {/* Hero */}
            <section className="mx-auto max-w-[90rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">
                            Uma proposta metodológica em desenvolvimento
                        </p>
                        <h1 className="mt-4 font-serif text-4xl font-light leading-[1.05] tracking-tight text-graphite md:text-6xl">
                            Resultados econômicos são produzidos por sistemas —{' '}
                            <em className="font-medium text-petrol">e pelas pessoas</em> que lideram, decidem, aprendem
                            e executam.
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite/75">
                            A Psiconometria é uma abordagem integrada que combina a mensuração rigorosa de
                            características humanas com métodos quantitativos de análise econômica — para compreender
                            como pessoas, comportamentos, relações e decisões influenciam processos e resultados
                            empresariais.
                        </p>
                        <div className="mt-8">
                            <Equation />
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/matriz"
                                className="inline-flex h-12 items-center gap-2 border border-graphite bg-graphite px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-petrol hover:border-petrol"
                            >
                                Explore as conexões <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                            </Link>
                            <Link
                                to="/metodo"
                                className="inline-flex h-12 items-center gap-2 border border-graphite/30 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite transition-colors hover:border-graphite"
                            >
                                Conheça o método
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="flex gap-4">
                            <figure className="flex-1">
                                <img
                                    src={HERO_IMG}
                                    alt="Profissionais em sessão de trabalho colaborativa em escritório brasileiro, com diagramas no quadro"
                                    className="aspect-[4/3] w-full object-cover"
                                    loading="eager"
                                />
                                <figcaption className="mt-2 text-[11px] leading-relaxed text-graphite/60">
                                    Fatores humanos viram comportamentos; comportamentos movem processos; processos
                                    movem indicadores. Sessão de trabalho, São Paulo.
                                </figcaption>
                            </figure>
                            <div className="caption-rail hidden text-[10px] uppercase tracking-[0.2em] text-graphite/40 md:block">
                                fig. 01 — camada humana · observação · 2025
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FlowStrip />

            {/* Três entradas */}
            <section className="mx-auto max-w-[90rem] px-5 py-16 md:px-10">
                <div className="grid gap-px bg-graphite/15 md:grid-cols-3">
                    {[
                        { to: '/o-que-e', n: '01', t: 'Entender o conceito', d: 'O que vem da psicometria, o que vem da econometria e o que surge da combinação — com limites claros.' },
                        { to: '/catalogo', n: '02', t: 'Explorar métodos', d: 'Um catálogo comparativo de avaliações comportamentais: o que medem, quando usar e o que não prometer.' },
                        { to: '/matriz', n: '03', t: 'Analisar KPIs', d: 'A matriz Pessoas × KPIs: mecanismos plausíveis entre fatores humanos e indicadores empresariais.' },
                    ].map((e) => (
                        <Link key={e.to} to={e.to} className="group bg-ivory p-8 transition-colors hover:bg-sand">
                            <span className="text-[11px] font-semibold tracking-[0.2em] text-graphite/40">{e.n}</span>
                            <span className="mt-3 flex items-center justify-between font-serif text-2xl italic text-graphite">
                                {e.t}
                                <ArrowUpRight className="h-5 w-5 text-petrol transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                            </span>
                            <span className="mt-3 block text-sm leading-relaxed text-graphite/70">{e.d}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Convergências */}
            <section className="bg-graphite py-16 text-ivory">
                <div className="mx-auto max-w-[90rem] px-5 md:px-10">
                    <Reveal>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">Mapa resumido</p>
                        <h2 className="mt-3 max-w-2xl font-serif text-3xl font-light italic leading-tight md:text-4xl">
                            Dez convergências entre duas disciplinas que raramente conversam
                        </h2>
                    </Reveal>
                    <div className="mt-10 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-5">
                        {CONVERGENCIAS.map((c, i) => (
                            <Link
                                key={c.id}
                                to={`/as-duas-disciplinas#${c.id}`}
                                className="group bg-graphite p-5 transition-colors hover:bg-petrol"
                            >
                                <span className="tnum text-[11px] tracking-[0.2em] text-ivory/40">{String(i + 1).padStart(2, '0')}</span>
                                <span className="mt-2 block text-sm font-semibold leading-snug">{c.titulo}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ferramenta interativa */}
            <section className="mx-auto max-w-[90rem] px-5 py-16 md:px-10">
                <Reveal>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Demonstração</p>
                    <h2 className="mt-3 font-serif text-3xl font-light italic leading-tight text-graphite md:text-4xl">
                        Da pessoa ao indicador: uma cadeia de mecanismos, não um salto de fé
                    </h2>
                </Reveal>
                <div className="mt-10">
                    <MiniMatriz />
                </div>
            </section>

            {/* Caso em destaque */}
            <section className="border-y border-graphite/15 bg-sand py-16">
                <div className="mx-auto grid max-w-[90rem] gap-10 px-5 md:grid-cols-12 md:px-10">
                    <div className="md:col-span-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Caso em destaque</p>
                        <h2 className="mt-3 font-serif text-3xl font-light italic leading-tight text-graphite">{destaque.titulo}</h2>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-graphite/60">
                            {destaque.organizacao} · {destaque.tipo} · {destaque.ano}
                        </p>
                    </div>
                    <div className="md:col-span-8">
                        <p className="text-base leading-relaxed text-graphite/80">{destaque.resumo} {destaque.resultados}</p>
                        <p className="mt-4 border-l-2 border-amber pl-4 text-sm leading-relaxed text-graphite/70">
                            <strong className="font-semibold">Ressalva:</strong> {destaque.limitacoes}
                        </p>
                        <Link to="/casos" className="mt-6 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-petrol hover:underline">
                            Ver os cinco casos com fontes <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* O que podemos medir */}
            <section className="mx-auto max-w-[90rem] px-5 py-16 md:px-10">
                <h2 className="font-serif text-3xl font-light italic leading-tight text-graphite md:text-4xl">
                    O que podemos medir — e o que não devemos prometer
                </h2>
                <div className="mt-10 grid gap-px bg-graphite/15 md:grid-cols-2">
                    <div className="bg-ivory p-8">
                        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
                            <Check className="h-4 w-4" strokeWidth={2} /> Podemos
                        </p>
                        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-graphite/80">
                            <li>Medir percepções, comportamentos e dinâmicas de equipe com instrumentos validados.</li>
                            <li>Relacionar fatores humanos a indicadores operacionais com incerteza explícita.</li>
                            <li>Testar intervenções com pilotos, grupos de comparação e linhas de base.</li>
                            <li>Aprender com cada ciclo e recalibrar hipóteses.</li>
                        </ul>
                    </div>
                    <div className="bg-ivory p-8">
                        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
                            <X className="h-4 w-4" strokeWidth={2} /> Não prometemos
                        </p>
                        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-graphite/80">
                            <li>Prever o sucesso de uma pessoa a partir de um perfil psicológico.</li>
                            <li>Ligar um traço de personalidade diretamente a valuation, faturamento ou lucro.</li>
                            <li>Substituir avaliação psicológica profissional por questionários de gestão.</li>
                            <li>Tratar correlação como causalidade — nunca.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTAs */}
            <section className="bg-petrol py-16 text-ivory">
                <div className="mx-auto grid max-w-[90rem] gap-10 px-5 md:grid-cols-2 md:px-10">
                    <div>
                        <h2 className="font-serif text-3xl font-light italic leading-tight">Iniciar um diagnóstico organizacional</h2>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/75">
                            Um diagnóstico não clínico da maturidade de mensuração da sua empresa: o que você já mede,
                            o que falta e por onde começar. Sem testes psicológicos, sem coleta de dados sensíveis.
                        </p>
                        <Link to="/sobre#contato" className="mt-6 inline-flex h-12 items-center gap-2 border border-ivory bg-ivory px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite transition-colors hover:bg-transparent hover:text-ivory">
                            Converse sobre sua empresa <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                    </div>
                    <div className="md:border-l md:border-ivory/20 md:pl-10">
                        <h2 className="font-serif text-3xl font-light italic leading-tight">Propor um projeto-piloto</h2>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/75">
                            Uma pergunta de negócio, uma linha de base, uma intervenção e indicadores acompanhados com
                            honestidade estatística. É assim que a Psiconometria se prova: em pequena escala, em público.
                        </p>
                        <Link to="/metodo" className="mt-6 inline-flex h-12 items-center gap-2 border border-ivory/40 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:border-ivory">
                            Ver as sete etapas <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Fontes */}
            <section className="mx-auto max-w-[90rem] px-5 py-12 md:px-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-graphite/50">
                    Compromisso metodológico e fontes
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-graphite/70">
                    Toda afirmação factual deste site indica fonte, ano e tipo de evidência. Trabalhamos a partir de
                    American Psychological Association, AERA/APA/NCME, Conselho Federal de Psicologia e SATEPSI, OECD,
                    World Bank, Google re:Work, Gallup e Our World in Data. Psiconometria é um conceito autoral em
                    desenvolvimento — não uma ciência oficialmente reconhecida nem uma disciplina acadêmica consolidada.
                </p>
            </section>
        </>
    );
};

export default HomePage;
