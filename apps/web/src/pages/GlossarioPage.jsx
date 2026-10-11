import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search } from 'lucide-react';
import { GLOSSARIO } from '@/data/glossario';

const GlossarioPage = () => {
    const [busca, setBusca] = useState('');
    const termos = useMemo(
        () =>
            GLOSSARIO.filter(
                (g) =>
                    !busca ||
                    `${g.termo} ${g.definicao}`.toLowerCase().includes(busca.toLowerCase()),
            ).sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR')),
        [busca],
    );

    return (
        <>
            <Helmet>
                <title>Conteúdo e glossário | Psiconometria</title>
                <meta
                    name="description"
                    content="Biblioteca editorial da Psiconometria: glossário de conceitos de psicometria e econometria com exemplos empresariais, guias e materiais em construção."
                />
            </Helmet>
            <section className="mx-auto max-w-[72rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Biblioteca editorial</p>
                <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                    Glossário
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                    Termos técnicos com explicação curta e exemplo empresarial. Artigos, guias executivos, análises de
                    instrumentos e materiais para download entram nesta biblioteca nas próximas edições.
                </p>

                <div className="relative mt-8 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/40" strokeWidth={1.5} />
                    <input
                        type="search"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar termo…"
                        aria-label="Buscar no glossário"
                        className="h-11 w-full border border-graphite/25 bg-transparent pl-10 pr-3 text-sm focus:border-petrol focus:outline-none"
                    />
                </div>

                {termos.length === 0 ? (
                    <p className="mt-10 border border-graphite/20 p-8 text-sm text-graphite/70">
                        Nenhum termo encontrado para “{busca}”.
                    </p>
                ) : (
                    <dl className="mt-8">
                        {termos.map((g) => (
                            <div key={g.termo} className="grid gap-2 border-t border-graphite/15 py-5 md:grid-cols-12">
                                <dt className="font-serif text-xl italic text-graphite md:col-span-4">{g.termo}</dt>
                                <dd className="md:col-span-8">
                                    <p className="text-sm leading-relaxed text-graphite/80">{g.definicao}</p>
                                    <p className="mt-1.5 border-l-2 border-teal pl-3 text-sm italic leading-relaxed text-graphite/65">
                                        {g.exemplo}
                                    </p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </section>
        </>
    );
};

export default GlossarioPage;
