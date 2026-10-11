import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const INTERESSES = [
    { value: 'diagnostico', label: 'Diagnóstico organizacional (não clínico)' },
    { value: 'projeto-piloto', label: 'Propor um projeto-piloto' },
    { value: 'conteudo-pesquisa', label: 'Conteúdo e pesquisa' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'colaboracao-academica', label: 'Colaboração acadêmica' },
    { value: 'newsletter', label: 'Apenas receber novos estudos' },
];

const inputClass =
    'h-11 w-full border border-graphite/25 bg-transparent px-3 text-sm text-graphite placeholder:text-graphite/40 focus:border-petrol focus:outline-none';

const ContactForm = ({ origem = 'pagina-sobre' }) => {
    const [form, setForm] = useState({ nome: '', email: '', empresa: '', interesse: '', mensagem: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | done | error
    const [error, setError] = useState('');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.nome.trim() || !form.email.trim() || !form.interesse) {
            setError('Preencha nome, e-mail e interesse para enviar.');
            return;
        }
        setStatus('sending');
        try {
            await pb.collection('contacts').create({ ...form, nome: form.nome.trim(), origem });
            setStatus('done');
        } catch (_) {
            setStatus('error');
            setError('Não foi possível enviar agora. Tente novamente em instantes.');
        }
    };

    if (status === 'done') {
        return (
            <div className="border border-teal p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
                    <Check className="h-4 w-4" strokeWidth={1.5} /> Mensagem registrada
                </p>
                <p className="mt-2 text-sm leading-relaxed text-graphite/70">
                    Obrigado pelo interesse. Retornaremos pelo e-mail informado. Enquanto isso, explore a Matriz
                    Pessoas × KPIs ou o Laboratório de impacto.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-5" noValidate={false}>
            <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="ct-nome" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">
                        Nome *
                    </label>
                    <input id="ct-nome" className={inputClass} value={form.nome} onChange={set('nome')} placeholder="Seu nome" required />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="ct-email" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">
                        E-mail *
                    </label>
                    <input id="ct-email" type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="voce@empresa.com" required />
                </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="ct-empresa" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">
                        Empresa / instituição
                    </label>
                    <input id="ct-empresa" className={inputClass} value={form.empresa} onChange={set('empresa')} placeholder="Opcional" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="ct-interesse" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">
                        Interesse *
                    </label>
                    <Select value={form.interesse} onValueChange={(v) => setForm((f) => ({ ...f, interesse: v }))}>
                        <SelectTrigger id="ct-interesse" className="h-11 rounded-none border-graphite/25 bg-transparent text-sm">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            {INTERESSES.map((i) => (
                                <SelectItem key={i.value} value={i.value}>
                                    {i.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="ct-mensagem" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">
                    Mensagem
                </label>
                <textarea
                    id="ct-mensagem"
                    rows={5}
                    className="w-full border border-graphite/25 bg-transparent px-3 py-2 text-sm text-graphite placeholder:text-graphite/40 focus:border-petrol focus:outline-none"
                    value={form.mensagem}
                    onChange={set('mensagem')}
                    placeholder="Conte em duas ou três frases o contexto: setor, tamanho da equipe e a pergunta de negócio que você gostaria de investigar."
                />
            </div>
            {error && (
                <p className="inline-flex items-center gap-2 text-sm text-coral" role="alert">
                    <AlertCircle className="h-4 w-4" strokeWidth={1.5} /> {error}
                </p>
            )}
            <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex h-12 items-center border border-graphite bg-graphite px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-petrol hover:border-petrol disabled:opacity-60"
            >
                {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
            </button>
            <p className="text-xs leading-relaxed text-graphite/60">
                Enviamos apenas o necessário para responder ao seu contato. Não coletamos dados psicológicos neste
                site. Consulte os princípios de ética e privacidade nesta página.
            </p>
        </form>
    );
};

export default ContactForm;
