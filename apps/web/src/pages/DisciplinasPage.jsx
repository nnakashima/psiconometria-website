import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PSICOMETRIA, ECONOMETRIA, CONVERGENCIAS } from '@/data/disciplinas';

const GRUPOS = {
    psicometria: { nome: 'Psicometria', cor: 'teal', dados: PSICOMETRIA, intro: 'A ciência da medida psicológica: como transformar características humanas em dados confiáveis, válidos e justos.' },
    econometria: { nome: 'Econometria', cor: 'cobalt', dados: ECONOMETRIA, intro: 'Métodos quantitativos aplicados a dados econômicos: como estimar relações, quantificar incerteza e aproximar causalidade.' },
    convergencias: { nome: 'Convergências', cor: 'petrol', dados: CONVERGENCIAS, intro: 'Onde as duas disciplinas se encontram — o terreno da Psiconometria.' },
};

const DisciplinasPage = () => {
    const [grupo, setGrupo] = useState('convergencias');
    const [sel, setSel] = useState(CONVERGENCIAS[0].id);
    const location = useLocation();

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (!hash) return;
        for (const [key, g] of Object.entries(GRUPOS)) {
            if (g.dados.some((d) => d.id === hash)) {
                setGrupo(key);
                setSel(hash);
            }
        }
    }, [location.hash]);

    const atual = GRUPOS[grupo];
    const item = atual.dados.find((d) => d.id === sel) || atual.dados[0];

    return (
        <>
            <Helmet>
                <title>As duas disciplinas | Psiconometria</title>
                <meta
                    name="description"
                    content="Dez fundamentos da psicometria, dez da econometria e dez convergências entre elas — com definições, exemplos organizacionais, métodos e limitações."
                />
            </Helmet>

            <section className="mx-auto max-w-[90rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Fundamentos</p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                    Dez assuntos de cada disciplina — e dez pontos de encontro
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                    Clique em cada assunto para ver definição simples, exemplo organizacional, método de análise,
                    decisão que pode apoiar, limitações e nível de evidência necessário.
                </p>

                <Tabs value={grupo} onValueChange={(v) => { setGrupo(v); setSel(GRUPOS[v].dados[0].id); }} className="mt-10">
                    <TabsList className="h-auto rounded-none border border-graphite/20 bg-transparent p-0">
                        {Object.entries(GRUPOS).map(([key, g]) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="rounded-none px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] data-[state=active]:bg-graphite data-[state=active]:text-ivory"
                            >
                                {g.nome}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <p className="mt-6 max-w-2xl text-sm italic leading-relaxed text-graphite/70">{atual.intro}</p>

                <div className="mt-8 grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <ol className="border-b border-graphite/15">
                            {atual.dados.map((d, i) => (
                                <li key={d.id} id={d.id}>
                                    <button
                                        onClick={() => setSel(d.id)}
                                        aria-current={sel === d.id}
                                        className={`flex w-full items-baseline gap-4 border-t border-graphite/15 py-3.5 text-left transition-colors ${
                                            sel === d.id ? 'text-petrol' : 'text-graphite/75 hover:text-graphite'
                                        }`}
                                    >
                                        <span className="tnum text-[11px] tracking-[0.16em] text-graphite/40">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="text-sm font-semibold leading-snug">{d.titulo}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="lg:col-span-7">
                        <article className="border border-graphite/20 bg-card p-7 md:p-9" aria-live="polite">
                            <h2 className="font-serif text-2xl font-light italic leading-snug text-graphite md:text-3xl">{item.titulo}</h2>
                            <dl className="mt-6 space-y-5">
                                {[
                                    ['Definição simples', item.definicao],
                                    ['Exemplo organizacional', item.exemplo],
                                    ['Método de análise', item.metodo],
                                    ['Decisão que pode apoiar', item.decisao],
                                    ['Limitações', item.limitacoes],
                                    ['Nível de evidência', item.evidencia],
                                ].map(([termo, valor]) => (
                                    <div key={termo} className="grid gap-1 border-t border-graphite/10 pt-4 md:grid-cols-12">
                                        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/50 md:col-span-4">{termo}</dt>
                                        <dd className="text-sm leading-relaxed text-graphite/80 md:col-span-8">{valor}</dd>
                                    </div>
                                ))}
                            </dl>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DisciplinasPage;
