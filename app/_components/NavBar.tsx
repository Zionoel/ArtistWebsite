"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

type Props = {
  locale: string;
  labels: {
    about: string;
    portfolio: string;
    commission: string;
    store: string;
    contact: string;
  };
};

export default function NavBar({ locale, labels }: Props) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/about`,      label: labels.about },
    { href: `/${locale}/portfolio`,  label: labels.portfolio },
    { href: `/${locale}/commission`, label: labels.commission },
    { href: `/${locale}/store`,      label: labels.store },
    { href: `/${locale}/contact`,    label: labels.contact },
  ];

  return (
    <>
      <nav className="h-14 flex justify-between items-center px-6 border-b border-white/10 relative z-50 bg-black">
        <Link
          href={`/${locale}`}
          onClick={() => setOpen(false)}
          className="font-semibold tracking-widest text-sm uppercase"
        >
          MontBlanc
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 text-sm">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white/50 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <LanguageSwitcher />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-5 h-px bg-white transition-transform origin-center ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`block w-5 h-px bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-white transition-transform origin-center ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-black border-b border-white/10 z-40 flex flex-col px-6 py-6 gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
