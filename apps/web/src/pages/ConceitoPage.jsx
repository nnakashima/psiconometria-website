import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

const CAMADA_HUMANA = [
    { id: 'caracteristicas', nome: 'Características individuais', desc: 'Traços, capacidades, valores e experiências que cada pessoa traz.', ligacoes: ['decisoes', 'produtividade'] },
    { id: 'estados', nome: 'Estados psicológicos', desc: 'Motivação, confiança, segurança psicológica e fadiga — variáveis que flutuam com o contexto.', ligacoes: ['decisoes', 'processos'] },
    { id: 'comportamentos', nome: 'Comportamentos observáveis', desc: 'O que de fato acontece: relatar erros, dar feedback, cooperar, aprender, decidir.', ligacoes: ['processos', 'cliente'] },
    { id: 'dinamica', nome: 'Dinâmica coletiva', desc: 'Como a equipe funciona junta: coordenação, conflito, coesão e aprendizagem.', ligacoes: ['processos', 'produtividade'] },
];

const CAMADA_EMPRESARIAL = [
    { id: 'decisoes', nome: 'Decisões', desc: 'Escolhas de alocação, prioridade e risco — tomadas por pessoas, sob incerteza.' },
    { id: 'processos', nome: 'Processos', desc: 'O trabalho organizado: fluxos, handoffs, controles e rituais.' },
    { id: 'cliente', nome: 'Experiência do cliente', desc: 'O que o cliente percebe: qualidade, confiança e continuidade.' },
    { id: 'produtividade', nome: 'Produtividade', desc: 'Output por unidade de recurso — gente, tempo, capital.' },
    { id: 'financeiros', nome: 'Resultados financeiros', desc: 'Receita, margens, custos — consequência de muitas causas.' },
    { id: 'valor', nome: 'Valor', desc: 'Resultado distal: valuation e rentabilidade dependem também de estratégia, mercado e capital.' },
];

const ConceitoPage = () => {
    const [ativo, setAtivo] = useState(null);
    const ligacoesAtivas = CAMADA_HUMANA.find((c) => c.id === ativo)?.ligacoes || [];

    return (
        <>
            <Helmet>
                <title>O que é Psiconometria | Psiconometria</title>
                <meta
                    name="description"
                    content="Origem, fundamentos e limites da Psiconometria: o que vem da psicometria, o que vem da econometria e o que surge da combinação das duas disciplinas."
                />
            </Helmet>

            <section className="mx-auto max-w-[72rem] px-5 pb-10 pt-14 md:px-10 md:pt-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">O conceito</p>
                <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                    Mensurar. Relacionar. Testar. Aprender. Decidir.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite/75">
                    Psiconometria é uma abordagem integrada que combina a mensuração rigorosa de características
                    humanas com métodos quantitativos de análise econômica, buscando compreender como pessoas,
                    comportamentos, relações e decisões influenciam processos e resultados empresariais. É um conceito
                    autoral, uma proposta metodológica em desenvolvimento e uma ferramenta de gestão orientada por
                    evidências — não uma ciência oficialmente reconhecida.
                </p>
            </section>

            {/* Três origens */}
            <section className="mx-auto max-w-[72rem] px-5 py-10 md:px-10">
                <div className="grid gap-px bg-graphite/15 md:grid-cols-3">
                    {[
                        { t: 'O que vem da psicometria', c: 'text-teal', items: ['Construtos bem definidos antes de medir', 'Confiabilidade e erro de medida', 'Evidências de validade para cada uso', 'Equidade e funcionamento diferencial de itens'] },
                        { t: 'O que vem da econometria', c: 'text-cobalt', items: ['Incerteza quantificada em toda estimativa', 'Separação entre previsão e causalidade', 'Experimentos e métodos quase-experimentais', 'Dados longitudinais e em painel'] },
                        { t: 'O que surge da combinação', c: 'text-petrol', items: ['Fatores humanos tratados como hipóteses mensuráveis', 'Cadeias de mecanismos até os KPIs', 'Pilotos com linha de base e grupo de comparação', 'Decisões que declaram premissas e limites'] },
                    ].map((col) => (
                        <div key={col.t} className="bg-ivory p-7">
                            <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${col.c}`}>{col.t}</p>
                            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-graphite/80">
                                {col.items.map((i) => (
                                    <li key={i} className="border-l border-graphite/20 pl-3">{i}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Diagrama de duas camadas */}
            <section className="bg-graphite py-16 text-ivory">
                <div className="mx-auto max-w-[90rem] px-5 md:px-10">
                    <Reveal>
                        <h2 className="font-serif text-3xl font-light italic leading-tight md:text-4xl">
                            Duas camadas, conexões plausíveis — nunca determinismo
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/70">
                            Toque em um elemento da camada humana para ver onde ele pode incidir na camada empresarial.
                            Nenhuma variável humana isolada determina um resultado financeiro.
                        </p>
                    </Reveal>

                    <div className="mt-10 space-y-8">
                        <div>
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">Camada humana</p>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {CAMADA_HUMANA.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => setAtivo(ativo === n.id ? null : n.id)}
                                        aria-pressed={ativo === n.id}
                                        className={`border p-4 text-left transition-colors ${
                                            ativo === n.id ? 'border-teal bg-teal text-ivory' : 'border-ivory/25 hover:border-teal'
                                        }`}
                                    >
                                        <span className="text-sm font-semibold">{n.nome}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3" aria-hidden="true">
                            <div className="h-px flex-1 bg-ivory/20" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">
                                {ativo ? 'conexões plausíveis destacadas' : 'influência indireta, mediada por processos'}
                            </span>
                            <div className="h-px flex-1 bg-ivory/20" />
                        </div>

                        <div>
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">Camada empresarial</p>
                            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                {CAMADA_EMPRESARIAL.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`border p-4 transition-colors ${
                                            ligacoesAtivas.includes(n.id) ? 'border-amber bg-amber/15 text-ivory' : 'border-ivory/25 text-ivory/80'
                                        }`}
                                    >
                                        <span className="text-sm font-semibold">{n.nome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="min-h-16 border border-ivory/20 p-5" aria-live="polite">
                            {ativo ? (
                                <>
                                    <p className="text-sm font-semibold text-teal">{CAMADA_HUMANA.find((c) => c.id === ativo).nome}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-ivory/80">{CAMADA_HUMANA.find((c) => c.id === ativo).desc}</p>
                                </>
                            ) : (
                                <p className="text-sm text-ivory/60">Selecione um elemento da camada humana para ver sua descrição e suas conexões plausíveis.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Distinções e limites */}
            <section className="mx-auto max-w-[72rem] px-5 py-16 md:px-10">
                <h2 className="font-serif text-3xl font-light italic leading-tight text-graphite">Distinções que protegem pessoas</h2>
                <div className="mt-8 space-y-0">
                    {[
                        { t: 'Diagnóstico organizacional', d: 'Lê sistemas: processos, clima agregado, dinâmicas de equipe. Não avalia indivíduos clinicamente.' },
                        { t: 'Avaliação psicológica', d: 'Prática privativa de psicólogos, regulamentada no Brasil, com instrumentos verificados no SATEPSI. A Psiconometria não a substitui.' },
                        { t: 'Teste comportamental', d: 'Instrumento de autodescrição ou preferência. Pode apoiar conversas de desenvolvimento; não deve decidir contratação, promoção ou demissão isoladamente.' },
                        { t: 'Correlação', d: 'Duas variáveis se movem juntas. Útil para gerar hipóteses e prever — insuficiente para afirmar causa.' },
                        { t: 'Causalidade', d: 'Um fator produz mudança em outro. Exige experimento, quase-experimento ou desenho de identificação — sempre com contexto e limites declarados.' },
                    ].map((item) => (
                        <div key={item.t} className="grid gap-2 border-t border-graphite/15 py-5 md:grid-cols-12">
                            <p className="text-sm font-semibold text-graphite md:col-span-4">{item.t}</p>
                            <p className="text-sm leading-relaxed text-graphite/75 md:col-span-8">{item.d}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 border border-amber bg-amber/10 p-6">
                    <p className="text-sm leading-relaxed text-graphite/85">
                        <strong className="font-semibold">Limites do método:</strong> resultados dependem de contexto,
                        população, qualidade dos dados e validação contínua. Compreender pessoas sem reduzir pessoas a
                        números é um compromisso de desenho — não um slogan.
                    </p>
                </div>

                <Link to="/as-duas-disciplinas" className="mt-10 inline-flex h-12 items-center gap-2 border border-graphite bg-graphite px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-petrol hover:border-petrol">
                    Ver as duas disciplinas <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
            </section>
        </>
    );
};

export default ConceitoPage;
