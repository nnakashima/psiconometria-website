import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FAMILIAS, METODOS } from '@/data/metodos';

const EV_COR = { Alta: 'bg-teal text-ivory', Moderada: 'bg-cobalt text-ivory', Limitada: 'bg-amber text-ivory', 'Em debate': 'bg-coral text-ivory' };
const ALL = 'todos';

const Card = ({ m }) => {
    const [risco, setRisco] = useState(false);
    return (
        <article className="flex flex-col border border-graphite/20 bg-card p-6">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-graphite">{m.nome}</h3>
                <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${EV_COR[m.evidencia]}`}>
                    {m.evidencia}
                </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-graphite/75">{m.mede}</p>
            <dl className="mt-4 space-y-1.5 text-xs text-graphite/70">
                <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold uppercase tracking-wide text-graphite/50">Mede</dt><dd>{m.tipo}</dd></div>
                <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold uppercase tracking-wide text-graphite/50">Uso</dt><dd>{m.uso}</dd></div>
                <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold uppercase tracking-wide text-graphite/50">KPIs</dt><dd>{m.kpis.join(' · ')}</dd></div>
                <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold uppercase tracking-wide text-graphite/50">Licença</dt><dd>{m.licenca}{m.restrito ? ' · restrito a psicólogos' : ''}</dd></div>
            </dl>
            <div className="mt-4 border-t border-graphite/10 pt-4 text-sm leading-relaxed">
                {risco ? (
                    <p className="text-graphite/80"><strong className="font-semibold text-coral">Riscos e limites: </strong>{m.riscos}</p>
                ) : (
                    <p className="text-graphite/80"><strong className="font-semibold text-teal">Potencial: </strong>{m.potencial}</p>
                )}
            </div>
            <div className="mt-auto pt-4">
                <button
                    onClick={() => setRisco(!risco)}
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-petrol underline-offset-4 hover:underline"
                >
                    {risco ? 'Ver potencial' : 'Ver riscos'}
                </button>
                <p className="mt-3 text-[10px] leading-relaxed text-graphite/50">
                    {m.satepsi} · Fonte: {m.fonte}
                </p>
            </div>
        </article>
    );
};

const CatalogoPage = () => {
    const [busca, setBusca] = useState('');
    const [f, setF] = useState({ finalidade: ALL, tipo: ALL, evidencia: ALL, aplicacao: ALL, restrito: ALL, licenca: ALL });

    const filtrados = useMemo(
        () =>
            METODOS.filter((m) => {
                if (busca && !`${m.nome} ${m.mede}`.toLowerCase().includes(busca.toLowerCase())) return false;
                if (f.finalidade !== ALL && !m.finalidade.includes(f.finalidade)) return false;
                if (f.tipo !== ALL && m.tipo !== f.tipo) return false;
                if (f.evidencia !== ALL && m.evidencia !== f.evidencia) return false;
                if (f.aplicacao !== ALL && !m.aplicacao.includes(f.aplicacao)) return false;
                if (f.restrito === 'sim' && !m.restrito) return false;
                if (f.restrito === 'nao' && m.restrito) return false;
                if (f.licenca !== ALL && m.licenca !== f.licenca) return false;
                return true;
            }),
        [busca, f],
    );

    const filtros = [
        ['finalidade', 'Finalidade', ['Seleção', 'Desenvolvimento', 'Equipes', 'Liderança', 'Cultura']],
        ['tipo', 'Tipo de construto', ['Traço', 'Estado', 'Preferência', 'Competência', 'Comportamento', 'Percepção']],
        ['evidencia', 'Nível de evidência', ['Alta', 'Moderada', 'Limitada', 'Em debate']],
        ['aplicacao', 'Aplicação', ['Individual', 'Coletiva', 'Organizacional']],
        ['restrito', 'Restrição', [['sim', 'Restrito a psicólogos'], ['nao', 'Não restrito']]],
        ['licenca', 'Licença', ['Gratuito', 'Licenciado', 'Proprietário']],
    ];

    return (
        <>
            <Helmet>
                <title>Catálogo de avaliações e métodos | Psiconometria</title>
                <meta
                    name="description"
                    content="Catálogo comparativo e filtrável de avaliações comportamentais: o que medem, nível de evidência, usos apropriados, riscos e situação no SATEPSI."
                />
            </Helmet>
            <section className="mx-auto max-w-[90rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Catálogo expansível</p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                    Avaliações e métodos, comparados com honestidade
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                    Um catálogo abrangente — não definitivo — organizado por famílias. Popularidade não é sinônimo de
                    validade: tipologias como DISC, MBTI e Eneagrama podem facilitar conversas, mas não são equivalentes
                    a instrumentos com maior sustentação psicométrica, e nenhum resultado deve ser usado isoladamente
                    para contratar, demitir ou promover.
                </p>

                <div className="mt-10 border border-graphite/20 bg-sand p-5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/40" strokeWidth={1.5} />
                        <input
                            type="search"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar método ou construto…"
                            aria-label="Buscar no catálogo"
                            className="h-11 w-full border border-graphite/25 bg-ivory pl-10 pr-3 text-sm focus:border-petrol focus:outline-none"
                        />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                        {filtros.map(([key, label, opcoes]) => (
                            <div key={key} className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-graphite/60">{label}</span>
                                <Select value={f[key]} onValueChange={(v) => setF((s) => ({ ...s, [key]: v }))}>
                                    <SelectTrigger className="h-10 rounded-none border-graphite/25 bg-ivory text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL}>Todos</SelectItem>
                                        {opcoes.map((o) => {
                                            const [val, lab] = Array.isArray(o) ? o : [o, o];
                                            return <SelectItem key={val} value={val}>{lab}</SelectItem>;
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-graphite/60" aria-live="polite">
                    {filtrados.length} de {METODOS.length} métodos
                </p>

                {filtrados.length === 0 ? (
                    <p className="mt-10 border border-graphite/20 p-8 text-sm text-graphite/70">
                        Nenhum método corresponde aos filtros. Amplie os critérios ou limpe a busca.
                    </p>
                ) : (
                    FAMILIAS.map((fam) => {
                        const itens = filtrados.filter((m) => m.familia === fam.id);
                        if (!itens.length) return null;
                        return (
                            <div key={fam.id} className="mt-12">
                                <h2 className="border-t-2 border-graphite pt-4 font-serif text-2xl font-light italic text-graphite">{fam.nome}</h2>
                                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {itens.map((m) => <Card key={m.id} m={m} />)}
                                </div>
                            </div>
                        );
                    })
                )}

                <div className="mt-14 flex gap-3 border border-amber bg-amber/10 p-6">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber" strokeWidth={1.5} />
                    <p className="text-sm leading-relaxed text-graphite/85">
                        Instrumentos precisam ser adequados ao propósito, à população, ao idioma e ao contexto. Testes
                        psicológicos de uso privativo devem ser aplicados por profissionais habilitados, e a situação de
                        cada instrumento no SATEPSI precisa ser verificada de forma atualizada antes do uso.
                    </p>
                </div>
            </section>
        </>
    );
};

export default CatalogoPage;
