import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

const ETAPAS = [
    { t: 'Definir a pergunta de negócio', d: 'Tudo começa de uma pergunta empresarial concreta — nunca de um teste procurando aplicação.' },
    { t: 'Mapear o processo e os KPIs', d: 'Entender o fluxo de trabalho, seus indicadores atuais e onde a pergunta vive no processo.' },
    { t: 'Formular hipóteses humanas e organizacionais', d: 'Transformar intuições em hipóteses falsificáveis sobre comportamentos, relações e condições de trabalho.' },
    { t: 'Selecionar medidas válidas e proporcionais', d: 'Escolher instrumentos com evidência para aquele propósito, população e idioma — nem mais, nem menos invasivos que o necessário.' },
    { t: 'Estabelecer linha de base', d: 'Medir antes de intervir. Sem linha de base, toda "melhora" é narrativa.' },
    { t: 'Testar intervenção e acompanhar resultados', d: 'Pilotos com grupo de comparação quando possível; indicadores antecedentes e resultantes monitorados.' },
    { t: 'Aprender, recalibrar e documentar limites', d: 'Registrar o que funcionou, o que não funcionou e até onde a conclusão pode ir.' },
];

const VERIFICAR = [
    'definição do processo', 'mudança de volume', 'ferramentas', 'treinamento', 'metas', 'qualidade dos insumos',
    'comunicação', 'composição da equipe', 'liderança', 'incentivos', 'fadiga', 'segurança psicológica', 'qualidade da mensuração',
];

const MetodoPage = () => (
    <>
        <Helmet>
            <title>Método Psiconometria | Psiconometria</title>
            <meta
                name="description"
                content="Uma metodologia prática em sete etapas: da pergunta de negócio à linha de base, do piloto à aprendizagem documentada — com limites declarados."
            />
        </Helmet>
        <section className="mx-auto max-w-[72rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Método</p>
            <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                Sete etapas, nenhum atalho
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite/75">
                A Psiconometria não começa aplicando testes. Começa de uma pergunta de negócio e termina em
                aprendizagem documentada — com limites explícitos.
            </p>

            <ol className="mt-12">
                {ETAPAS.map((e, i) => (
                    <Reveal key={e.t} delay={i * 0.05}>
                        <li className="relative border-l border-graphite/25 pb-10 pl-8">
                            <span className="tnum absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-petrol bg-ivory text-[11px] font-bold text-petrol">
                                {i + 1}
                            </span>
                            <h2 className="text-lg font-bold text-graphite">{e.t}</h2>
                            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-graphite/75">{e.d}</p>
                        </li>
                    </Reveal>
                ))}
            </ol>

            <div className="mt-6 border border-graphite/20 bg-sand p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-petrol">Exemplo</p>
                <h2 className="mt-2 font-serif text-2xl font-light italic text-graphite">
                    “Por que a taxa de retrabalho aumentou?”
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-graphite/80">
                    A resposta não começa com um teste de personalidade. Antes de formular qualquer hipótese humana,
                    verifique:
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                    {VERIFICAR.map((v) => (
                        <li key={v} className="border border-graphite/25 bg-ivory px-2.5 py-1 text-xs text-graphite/75">{v}</li>
                    ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-graphite/80">
                    Só depois disso as hipóteses humanas — fadiga, segurança psicológica, clareza de papéis — entram em
                    cena, com medidas proporcionais e um plano de teste.
                </p>
            </div>

            <Link
                to="/sobre#contato"
                className="mt-10 inline-flex h-12 items-center gap-2 border border-graphite bg-graphite px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-petrol hover:border-petrol"
            >
                Proponha um projeto-piloto <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
        </section>
    </>
);

export default MetodoPage;
