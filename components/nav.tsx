'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const LINKS = [
  { href: '/',                 label: 'Dashboard' },
  { href: '/bom-audit',        label: '🔬 BOM Audit' },
  { href: '/contamination',    label: '☁️ Contamination' },
  { href: '/qualification',    label: 'Full Qual' },
  { href: '/type2',            label: '⚡ Type II' },
  { href: '/orbit-comparison', label: 'Orbit Cmp' },
  { href: '/outgassing',       label: 'Outgassing' },
  { href: '/radiation',        label: 'Radiation' },
  { href: '/thermal',          label: 'Thermal' },
  { href: '/spacechem',        label: 'SpaceChem-AI' },
  { href: '/materials',        label: 'Materials' },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-navy/95 backdrop-blur-xl border-b border-white/6 flex items-center px-6 gap-4">
      <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
        <img src="https://chemenova.com/logo.png" alt="" className="h-7 w-auto rounded" onError={e => (e.currentTarget.style.display='none')} />
        <span className="font-serif text-light text-lg font-light hidden sm:block">
          Orbit<span className="text-teal">Chem</span>
          <sup className="font-mono text-[9px] text-teal/60 tracking-widest ml-0.5">™</sup>
        </span>
        <span className="hidden lg:flex items-center gap-1 text-[9px] font-mono tracking-[0.2em] text-muted/60 uppercase border border-white/8 px-2 py-0.5 rounded">
          v2.0
        </span>
      </Link>

      {/* Desktop */}
      <div className="hidden xl:flex items-center gap-0.5 flex-1 overflow-x-auto">
        {LINKS.map(l => (
          <Link key={l.href} href={l.href}
            className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-wide whitespace-nowrap transition-all ${
              path === l.href
                ? 'bg-teal/15 text-teal border border-teal/25'
                : 'text-muted hover:text-light hover:bg-white/4'
            }`}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <a href="https://chemenova.com/orbitchem" className="hidden sm:block text-[10px] font-mono tracking-widest uppercase text-muted border border-white/10 px-3 py-1.5 rounded hover:text-light hover:border-white/25 transition-all">
          About
        </a>
        <a href="mailto:shehan@chemenova.com?subject=OrbitChem Enterprise"
           className="text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded bg-teal text-navy font-bold hover:bg-teal2 transition-all">
          Enterprise
        </a>
        <button onClick={() => setOpen(o => !o)} className="xl:hidden p-1.5 text-muted hover:text-light">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden absolute top-16 inset-x-0 bg-surface border-b border-white/8 p-4 grid grid-cols-2 gap-1.5">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                path === l.href ? 'bg-teal/15 text-teal' : 'text-muted hover:text-light hover:bg-white/5'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
