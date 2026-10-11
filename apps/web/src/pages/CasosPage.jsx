import React from 'react';
import { Helmet } from 'react-helmet';
import { ExternalLink } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { CASOS, TIPO_CORES } from '@/data/casos';

const IMG = 'https://images.hostinger.com/a57b3388-8503-4a35-9a83-201b9c1c7b8b.png';

const CasosPage = () => (
    <>
        <Helmet>
            <title>Casos e evidências | Psiconometria</title>
            <meta
                name="description"
                content="Casos reais e pesquisas verificáveis — Google Project Aristotle e Oxygen, meta-análise Gallup Q12, OECD e Microsoft — com método, resultados, limitações e fontes originais."
            />
        </Helmet>
        <section className="mx-auto max-w-[90rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
            <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Evidência verificável</p>
                    <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                        Casos reais, com fontes e limites declarados
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                        Cada caso separa problema, hipótese, dados, método, intervenção, resultados e limitações.
                        Nenhum depoimento inventado, nenhum número sem fonte, nenhuma relação causal não demonstrada.
                    </p>
                </div>
                <figure className="lg:col-span-5">
                    <img src={IMG} alt="Duas pessoas analistas revisando gráficos impressos em um escritório brasileiro" className="aspect-[16/9] w-full object-cover" loading="lazy" />
                    <figcaption className="mt-2 text-[11px] text-graphite/60">Análise de dados de pessoas exige o mesmo rigor da análise financeira.</figcaption>
                </figure>
            </div>

            <div className="mt-14 space-y-16">
                {CASOS.map((c, idx) => (
                    <Reveal key={c.id}>
                        <article className="grid gap-8 border-t-2 border-graphite pt-8 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${TIPO_CORES[c.tipo]}`}>
                                    {c.tipo}
                                </span>
                                <h2 className="mt-3 font-serif text-3xl font-light italic leading-tight text-graphite">{c.titulo}</h2>
                                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-graphite/60">
                                    {c.organizacao} · {c.ano}
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-graphite/75">{c.resumo}</p>
                                <a
                                    href={c.fonte.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-petrol hover:underline"
                                >
                                    Fonte original <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </a>
                            </div>
                            <div className="lg:col-span-8">
                                <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                                    {[
                                        ['Problema', c.problema],
                                        ['Hipótese', c.hipotese],
                                        ['Dados utilizados', c.dados],
                                        ['Método', c.metodo],
                                        ['Intervenção', c.intervencao],
                                        ['Resultados informados', c.resultados],
                                    ].map(([t, v]) => (
                                        <div key={t} className="border-t border-graphite/10 pt-3">
                                            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/50">
                                                <span className="tnum mr-2 text-graphite/35">{String(idx + 1).padStart(2, '0')}</span>{t}
                                            </dt>
                                            <dd className="mt-1.5 text-sm leading-relaxed text-graphite/80">{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <div className="mt-5 grid gap-px bg-graphite/15 md:grid-cols-2">
                                    <div className="bg-amber/10 p-4">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">Limitações</p>
                                        <p className="mt-1.5 text-sm leading-relaxed text-graphite/80">{c.limitacoes}</p>
                                    </div>
                                    <div className="bg-teal/10 p-4">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">O que pode ser aprendido</p>
                                        <p className="mt-1.5 text-sm leading-relaxed text-graphite/80">{c.aprendizado}</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    </>
);

export default CasosPage;
