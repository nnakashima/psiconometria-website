import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm';

const IMG = 'https://images.hostinger.com/4f47b864-f70e-4130-8608-505367283e70.png';

const Principios = ({ titulo, items }) => (
    <div className="border-t border-graphite/15 py-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-graphite">{titulo}</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
            {items.map((i) => (
                <li key={i} className="border-l border-petrol/40 pl-3 text-sm leading-relaxed text-graphite/75">{i}</li>
            ))}
        </ul>
    </div>
);

const SobrePage = () => (
    <>
        <Helmet>
            <title>Sobre, ética e contato | Psiconometria</title>
            <meta
                name="description"
                content="Manifesto, princípios metodológicos, política de fontes, ética e privacidade da Psiconometria — e como propor um projeto-piloto ou colaboração."
            />
        </Helmet>
        <section className="mx-auto max-w-[72rem] px-5 pb-16 pt-14 md:px-10 md:pt-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-petrol">Sobre</p>
            <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-graphite md:text-5xl">
                Manifesto da Psiconometria
            </h1>
            <blockquote className="mt-8 border-l-2 border-amber pl-6 font-serif text-2xl font-light italic leading-relaxed text-graphite/90">
                Compreender pessoas sem reduzir pessoas a números. Transformar fatores humanos em hipóteses mensuráveis
                — e hipóteses em decisões verificáveis, com rigor quantitativo, contexto e ética.
            </blockquote>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite/75">
                Pessoas não são ativos mecânicos, rankings ou meros recursos produtivos. A Psiconometria existe para
                que organizações tratem fatores humanos com o mesmo rigor com que tratam números — e tratem números
                sobre pessoas com o mesmo cuidado com que tratam pessoas.
            </p>

            <figure className="mt-10">
                <img src={IMG} alt="Roda de conversa em sessão de aprendizagem corporativa em empresa brasileira" className="aspect-[3/2] w-full object-cover" loading="lazy" />
                <figcaption className="mt-2 text-[11px] text-graphite/60">
                    Aprendizagem coletiva: o ativo que nenhum dashboard captura sozinho.
                </figcaption>
            </figure>

            <div className="mt-12">
                <Principios
                    titulo="Princípios metodológicos"
                    items={[
                        'Toda afirmação factual indica fonte, ano e tipo de evidência.',
                        'Correlação e causalidade são sempre separadas.',
                        'Estimativas vêm com intervalos e premissas visíveis.',
                        'Nenhum instrumento decide sozinho sobre pessoas.',
                        'Contexto, população e propósito limitam toda conclusão.',
                        'Hipóteses são registradas antes dos resultados.',
                    ]}
                />
                <Principios
                    titulo="Política de fontes"
                    items={[
                        'Prioridade a fontes acadêmicas, institucionais e primárias.',
                        'Resumimos e contextualizamos — nunca copiamos textos.',
                        'Distinguimos dado global de dado brasileiro.',
                        'Sinalizamos quando a evidência é observacional.',
                        'Não transportamos conclusões entre contextos sem ressalva.',
                    ]}
                />
                <Principios
                    titulo="Ética, privacidade e uso responsável"
                    items={[
                        'Psiconometria não substitui avaliação psicológica profissional.',
                        'Testes de uso privativo exigem profissionais habilitados; o SATEPSI deve ser consultado de forma atualizada.',
                        'Perfis não são diagnósticos.',
                        'Dados comportamentais exigem finalidade legítima, minimização, segurança e governança (LGPD).',
                        'Decisões automatizadas que afetam pessoas precisam de transparência e revisão.',
                        'Resultados individuais nunca aparecem em dashboards coletivos; usamos anonimização e limites mínimos de grupo.',
                        'Este site não coleta dados psicológicos antes de consentimento, governança e segurança adequados.',
                    ]}
                />
            </div>

            <div className="mt-12 border border-dashed border-graphite/30 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite/50">Informações institucionais</p>
                <p className="mt-2 text-sm italic leading-relaxed text-graphite/60">
                    [Marcador editável: equipe, credenciais, clientes, parceiros e endereço serão publicados aqui quando
                    fornecidos — sem invenções.]
                </p>
            </div>

            <div id="contato" className="mt-14 scroll-mt-24 border-t-2 border-graphite pt-10">
                <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <h2 className="font-serif text-3xl font-light italic leading-tight text-graphite">Contato</h2>
                        <p className="mt-4 text-sm leading-relaxed text-graphite/75">
                            Empresas interessadas em diagnóstico organizacional não clínico ou projetos-piloto, e
                            pesquisadores e profissionais interessados em colaboração, são bem-vindos.
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-graphite/75">
                            Responderemos pelo e-mail informado. Nenhum dado psicológico é solicitado neste formulário.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default SobrePage;
