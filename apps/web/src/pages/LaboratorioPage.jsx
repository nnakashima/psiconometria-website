import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle } from 'lucide-react';

const BRL = (v) =>
    v >= 1e6 ? `R$ ${(v / 1e6).toFixed(1).replace('.', ',')} mi` : `R$ ${Math.round(v / 1e3)} mil`;

const Campo = ({ label, valor, set, min, max, passo, unidade }) => (
    <div className="border-t border-graphite/15 py-4">
        <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={`campo-${label}`} className="text-sm font-semibold text-graphite">{label}</label>
            <span className="tnum text-sm font-bold text-petrol">
                {valor.toLocaleString('pt-BR')}{unidade}
            </span>
        </div>
        <input
            id={`campo-${label}`}
            type="range"
            min={min}
            max={max}
            step={passo}
            value={valor}
            onChange={(e) => set(Number(e.target.value))}
            className="mt-2 w-full accent-[hsl(var(--petrol))]"
        />
    </div>
);

const LaboratorioPage = () => {
    const [empregados, setEmpregados] = useState(250);
    const [faturamento, setFaturamento] = useState(80); // R$ mi/ano
    const [salario, setSalario] = useState(6000); // mensal
    const [turnover, setTurnover] = useState(18); // %
    const [absenteismo, setAbsenteismo] = useState(5); // %
    const [retrabalho, setRetrabalho] = useState(8); // % do esforço
    const [investimento, setInvestimento] = useState(300); // R$ mil

    const r = useMemo(() => {
        const salarioAno = salario * 13.3;
        const custoTurn = empregados * (turnover / 100) * salarioAno * 0.6; // reposição ≈ 60% do salário anual
        const custoAbs = empregados * salarioAno * (absenteismo / 100);
        const custoRetr = faturamento * 1e6 * (retrabalho / 100) * 0.35; // 35% do valor do esforço refeito vira custo
        const cenarios = [
            { nome: 'Conservador', f: 0.05 },
            { nome: 'Central', f: 0.1 },
            { nome: 'Otimista', f: 0.2 },
        ].map((c) => {
            const economia = (custoTurn + custoAbs + custoRetr) * c.f;
            return { ...c, economia, min: economia * 0.5, max: economia * 1.6, roi: economia / (investimento * 1e3) };
        });
        const base = { custoTurn, custoAbs, custoRetr };
        const sens = [
            { nome: 'Turnover', v: custoTurn },
            { nome: 'Retrabalho', v: custoRetr },
            { nome: 'Absenteísmo', v: custoAbs },
        ].sort((a, b) => b.v - a.v);
        return { cenarios, base, sens };
    }, [empregados, faturamento, salario, turnover, absenteismo, retrabalho, investimento]);

    const maxEco = Math.max(...r.cenarios.map((c) => c.max));

    return (
        <>
            <Helmet>
                <title>Laboratório de impacto | Psiconometria</title>
                <meta
                    name="description"
                    content="Simulador educacional com premissas editáveis: estime faixas de economia possível ao reduzir turnover, absenteísmo e retrabalho — com cenários, incerteza e plano de teste."
                />
            </Helmet>
            <section className="mx-auto max-w-[90rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Simulador educacional</p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                    Laboratório de impacto
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                    Uma ferramenta educacional baseada em premissas editáveis — não uma previsão garantida. Altere
                    qualquer premissa e observe como as faixas de resultado se movem.
                </p>

                <div className="mt-10 grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite/60">Premissas da sua empresa</p>
                        <Campo label="Empregados" valor={empregados} set={setEmpregados} min={20} max={5000} passo={10} unidade="" />
                        <Campo label="Faturamento anual" valor={faturamento} set={setFaturamento} min={5} max={1000} passo={5} unidade=" mi" />
                        <Campo label="Salário médio mensal" valor={salario} set={setSalario} min={2000} max={25000} passo={250} unidade="" />
                        <Campo label="Turnover anual" valor={turnover} set={setTurnover} min={2} max={60} passo={1} unidade="%" />
                        <Campo label="Absenteísmo" valor={absenteismo} set={setAbsenteismo} min={1} max={20} passo={0.5} unidade="%" />
                        <Campo label="Retrabalho" valor={retrabalho} set={setRetrabalho} min={1} max={30} passo={1} unidade="%" />
                        <Campo label="Investimento previsto" valor={investimento} set={setInvestimento} min={50} max={3000} passo={50} unidade=" mil" />
                        <p className="mt-4 text-xs leading-relaxed text-graphite/60">
                            Premissas fixas do modelo: reposição ≈ 60% do salário anual por saída; 35% do valor do
                            retrabalho vira custo; reduções relativas de 5%, 10% e 20% nos três custos, por cenário.
                        </p>
                    </div>

                    <div className="lg:col-span-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite/60">
                            Custo anual estimado hoje
                        </p>
                        <div className="mt-3 grid gap-px border border-graphite/15 bg-graphite/15 sm:grid-cols-3">
                            {[['Turnover', r.base.custoTurn], ['Absenteísmo', r.base.custoAbs], ['Retrabalho', r.base.custoRetr]].map(([n, v]) => (
                                <div key={n} className="bg-ivory p-5">
                                    <p className="text-[11px] uppercase tracking-[0.12em] text-graphite/60">{n}</p>
                                    <p className="tnum mt-1 text-2xl font-black text-graphite">{BRL(v)}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite/60">
                            Economia anual possível, por cenário (faixas = incerteza)
                        </p>
                        <div className="mt-4 space-y-6">
                            {r.cenarios.map((c) => (
                                <div key={c.nome}>
                                    <div className="flex items-baseline justify-between">
                                        <p className="text-sm font-semibold text-graphite">{c.nome}</p>
                                        <p className="tnum text-sm text-graphite/70">
                                            {BRL(c.min)} — {BRL(c.max)} · retorno de {c.roi.toFixed(1).replace('.', ',')}× o investimento
                                        </p>
                                    </div>
                                    <div className="relative mt-2 h-6 w-full bg-sand">
                                        <div
                                            className="absolute top-1/2 h-2 -translate-y-1/2 bg-petrol/25"
                                            style={{ left: `${(c.min / maxEco) * 100}%`, width: `${((c.max - c.min) / maxEco) * 100}%` }}
                                        />
                                        <div className="absolute top-0 h-full bg-petrol" style={{ width: `${(c.economia / maxEco) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 grid gap-px border border-graphite/15 bg-graphite/15 md:grid-cols-2">
                            <div className="bg-ivory p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/60">Sensibilidade</p>
                                <p className="mt-2 text-sm leading-relaxed text-graphite/80">
                                    A variável que mais move o resultado é <strong className="font-semibold">{r.sens[0].nome.toLowerCase()}</strong>.
                                    Comece medindo-a bem antes de investir.
                                </p>
                            </div>
                            <div className="bg-ivory p-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/60">Prazo e acompanhamento</p>
                                <p className="mt-2 text-sm leading-relaxed text-graphite/80">
                                    Sinais em 1–2 trimestres; efeitos financeiros em 3–6. Acompanhe indicadores
                                    antecedentes (relatos de erro, adesão, pulso) além dos financeiros.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 border border-graphite/20 bg-sand p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/60">Como testar de verdade</p>
                            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-graphite/80">
                                <li>· Piloto em algumas equipes, com linha de base registrada antes.</li>
                                <li>· Grupo de comparação semelhante que não recebe a intervenção.</li>
                                <li>· Séries históricas para separar tendência de efeito.</li>
                                <li>· Diferenças-em-diferenças para estimar o efeito incremental.</li>
                            </ul>
                        </div>

                        <p className="mt-6 flex gap-2 border border-amber bg-amber/10 p-4 text-sm text-graphite/85">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber" strokeWidth={1.5} />
                            Estimativas ilustrativas, não fatos. Os multiplicadores são premissas didáticas; a sua
                            organização precisa estimá-los com os próprios dados.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LaboratorioPage;
