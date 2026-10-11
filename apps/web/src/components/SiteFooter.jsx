import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { NAV_ITEMS } from './SiteHeader';

const SiteFooter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | done | error

    const subscribe = async (e) => {
        e.preventDefault();
        if (!email || status === 'sending') return;
        setStatus('sending');
        try {
            await pb.collection('contacts').create({
                nome: 'Assinante da newsletter',
                email,
                interesse: 'newsletter',
                mensagem: '',
                origem: 'rodape',
            });
            setStatus('done');
            setEmail('');
        } catch (_) {
            setStatus('error');
        }
    };

    return (
        <footer className="bg-graphite text-ivory">
            <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-14 md:grid-cols-12 md:px-10">
                <div className="md:col-span-5">
                    <p className="text-lg font-black uppercase tracking-tight">Psiconometria</p>
                    <p className="mt-3 max-w-md font-serif text-sm italic leading-relaxed text-ivory/70">
                        Uma abordagem integrada que combina a mensuração rigorosa de características humanas com
                        métodos quantitativos de análise econômica — para compreender como pessoas, comportamentos,
                        relações e decisões influenciam processos e resultados empresariais.
                    </p>
                    <div className="mt-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/60">
                            Receba novos estudos
                        </p>
                        {status === 'done' ? (
                            <p className="mt-3 inline-flex items-center gap-2 border border-teal px-3 py-2 text-sm text-teal">
                                <Check className="h-4 w-4" strokeWidth={1.5} /> Inscrição registrada. Obrigado.
                            </p>
                        ) : (
                            <form onSubmit={subscribe} className="mt-3 flex max-w-md">
                                <label htmlFor="newsletter-email" className="sr-only">
                                    Seu e-mail
                                </label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="h-11 w-full border border-ivory/30 bg-transparent px-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-teal focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="inline-flex h-11 shrink-0 items-center gap-1 border border-teal bg-teal px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-transparent hover:text-teal disabled:opacity-60"
                                >
                                    Assinar <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </button>
                            </form>
                        )}
                        {status === 'error' && (
                            <p className="mt-2 text-xs text-coral">Não foi possível registrar. Tente novamente.</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/60">Navegação</p>
                    <ul className="mt-4 space-y-2">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.to}>
                                <Link to={item.to} className="text-sm text-ivory/80 transition-colors hover:text-teal">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/60">
                        Compromisso metodológico
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ivory/70">
                        <li>Correlação não comprova causalidade.</li>
                        <li>Nenhum instrumento deve ser usado isoladamente em decisões de alto impacto.</li>
                        <li>Testes psicológicos de uso privativo exigem profissionais habilitados.</li>
                        <li>Toda afirmação factual indica fonte, ano e tipo de evidência.</li>
                    </ul>
                    <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-ivory/50">
                        Fontes de referência: APA · AERA/NCME · CFP/SATEPSI · OECD · World Bank · Google re:Work ·
                        Gallup · Our World in Data
                    </p>
                </div>
            </div>
            <div className="border-t border-ivory/15">
                <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-5 py-5 text-[11px] uppercase tracking-[0.14em] text-ivory/50 md:flex-row md:items-center md:justify-between md:px-10">
                    <span>© {new Date().getFullYear()} Psiconometria — conceito autoral em desenvolvimento</span>
                    <span>www.psiconometria.com</span>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
