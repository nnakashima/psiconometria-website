import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
    { to: '/o-que-e', label: 'O conceito' },
    { to: '/as-duas-disciplinas', label: 'Disciplinas' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/matriz', label: 'Matriz' },
    { to: '/laboratorio', label: 'Laboratório' },
    { to: '/casos', label: 'Casos' },
    { to: '/metodo', label: 'Método' },
    { to: '/glossario', label: 'Glossário' },
    { to: '/sobre', label: 'Sobre' },
];

const SiteHeader = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-graphite/15 bg-ivory/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-5 py-3 md:px-10">
                <Link to="/" className="group flex items-baseline gap-2">
                    <span className="text-base font-black uppercase tracking-tight text-graphite md:text-lg">
                        Psiconometria
                    </span>
                    <span className="hidden font-serif text-xs italic text-muted-foreground lg:inline">
                        pessoas, dados e resultados
                    </span>
                </Link>

                <nav aria-label="Navegação principal" className="hidden items-center gap-4 xl:flex">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-petrol',
                                    isActive ? 'text-petrol underline underline-offset-4' : 'text-graphite/70',
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <Link
                        to="/sobre#contato"
                        className="ml-2 inline-flex items-center gap-1 border border-graphite bg-graphite px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-petrol hover:border-petrol"
                    >
                        Contato <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                </nav>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger
                        className="inline-flex h-11 w-11 items-center justify-center border border-graphite/20 text-graphite xl:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu className="h-5 w-5" strokeWidth={1.5} />
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 bg-ivory">
                        <p className="mb-6 text-sm font-black uppercase tracking-tight">Psiconometria</p>
                        <nav className="flex flex-col" aria-label="Navegação móvel">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            'border-t border-graphite/10 py-3 text-sm font-semibold uppercase tracking-[0.12em]',
                                            isActive ? 'text-petrol' : 'text-graphite/80',
                                        )
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                            <Link
                                to="/sobre#contato"
                                onClick={() => setOpen(false)}
                                className="mt-4 inline-flex items-center justify-center gap-1 border border-graphite bg-graphite px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory"
                            >
                                Fale conosco <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

export default SiteHeader;
