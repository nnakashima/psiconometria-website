import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowDown, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { FATORES, KPIS, EVIDENCIA_CORES } from '@/data/fatores';

const ETAPAS = ['Comportamento observável', 'Efeito no processo', 'Indicador antecedente', 'KPI operacional', 'KPI financeiro'];

const MatrizPage = () => {
    const [sel, setSel] = useState('seguranca-psicologica');
    const fator = FATORES.find((f) => f.id === sel);
    const kpisDoFator = KPIS.filter((k) => fator.kpis.includes(k.id));

    return (
        <>
            <Helmet>
                <title>Matriz Pessoas × KPIs | Psiconometria</title>
                <meta
                    name="description"
                    content="Ferramenta exploratória que conecta fatores humanos a indicadores empresariais por cadeias de mecanismos plausíveis — com impactos positivos e negativos, moderadores e força da evidência."
                />
            </Helmet>
            <section className="mx-auto max-w-[90rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Ferramenta exploratória</p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                    Matriz Pessoas × KPIs
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                    Selecione um fator humano e veja os mecanismos pelos quais ele pode afetar resultados empresariais.
                    Não existe relação direta e determinística entre um perfil psicológico e valuation, faturamento ou
                    lucro — esses são resultados distais, influenciados por estratégia, mercado, capital e concorrência.
                </p>

                <div className="mt-10 grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite/60">Fatores humanos</p>
                        <div className="mt-3 grid grid-cols-2 gap-px border border-graphite/15 bg-graphite/15 lg:grid-cols-1">
                            {FATORES.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setSel(f.id)}
                                    aria-current={sel === f.id}
                                    className={`px-4 py-3 text-left text-sm font-semibold transition-colors ${
                                        sel === f.id ? 'bg-petrol text-ivory' : 'bg-ivory text-graphite/75 hover:bg-sand'
                                    }`}
                                >
                                    {f.nome}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8" aria-live="polite">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-serif text-3xl font-light italic text-graphite">{fator.nome}</h2>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${EVIDENCIA_CORES[fator.evidencia]}`}>
                                Evidência {fator.evidencia.toLowerCase()}
                            </span>
                        </div>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite/70">{fator.descricao}</p>

                        <ol className="mt-8">
                            {fator.cadeia.map((step, i) => (
                                <li key={i} className="relative pb-6 pl-8">
                                    {i < fator.cadeia.length - 1 && (
                                        <ArrowDown className="absolute left-0 top-7 h-4 w-4 text-graphite/30" strokeWidth={1.5} aria-hidden="true" />
                                    )}
                                    <span className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-petrol bg-ivory" aria-hidden="true" />
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-graphite/50">{ETAPAS[i]}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-graphite/85">{step}</p>
                                </li>
                            ))}
                        </ol>

                        <div className="grid gap-px border border-graphite/15 bg-graphite/15 md:grid-cols-2">
                            <div className="bg-ivory p-5">
                                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">
                                    <TrendingUp className="h-4 w-4" strokeWidth={1.5} /> Impacto positivo plausível
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-graphite/80">{fator.positivo}</p>
                            </div>
                            <div className="bg-ivory p-5">
                                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                                    <TrendingDown className="h-4 w-4" strokeWidth={1.5} /> Impacto negativo plausível
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-graphite/80">{fator.negativo}</p>
                            </div>
                        </div>

                        <dl className="mt-6 grid gap-5 md:grid-cols-2">
                            <div className="border-t border-graphite/15 pt-3">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/50">Variáveis moderadoras</dt>
                                <dd className="mt-2 flex flex-wrap gap-1.5">
                                    {fator.moderadoras.map((m) => (
                                        <span key={m} className="border border-graphite/25 px-2 py-1 text-xs text-graphite/75">{m}</span>
                                    ))}
                                </dd>
                            </div>
                            <div className="border-t border-graphite/15 pt-3">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/50">Prazo provável</dt>
                                <dd className="mt-2 text-sm text-graphite/80">{fator.prazo}</dd>
                            </div>
                            <div className="border-t border-graphite/15 pt-3">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/50">Dados necessários</dt>
                                <dd className="mt-2 text-sm leading-relaxed text-graphite/80">{fator.dados.join(' · ')}</dd>
                            </div>
                            <div className="border-t border-graphite/15 pt-3">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/50">KPIs potencialmente relacionados</dt>
                                <dd className="mt-2 flex flex-wrap gap-1.5">
                                    {kpisDoFator.map((k) => (
                                        <span key={k.id} className={`px-2 py-1 text-xs ${k.distal ? 'border border-dashed border-graphite/40 text-graphite/60' : 'bg-graphite text-ivory'}`} title={k.distal ? 'Resultado distal — influência indireta' : ''}>
                                            {k.nome}{k.distal ? ' (distal)' : ''}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                        </dl>

                        {(fator.evidencia === 'Emergente' || fator.evidencia === 'Hipótese') && (
                            <p className="mt-6 flex gap-2 border border-amber bg-amber/10 p-4 text-sm text-graphite/85">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-amber" strokeWidth={1.5} />
                                Para este fator, a relação com resultados é majoritariamente hipótese ou correlação.
                                Trate como pergunta a testar, não como alavanca garantida.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default MatrizPage;
