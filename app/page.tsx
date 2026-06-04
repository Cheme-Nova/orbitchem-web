import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard — OrbitChem™' }

const MODULES = [
  { href:'/qualification', icon:'🛰️', title:'Full Qualification Suite', desc:'Outgassing + radiation + thermal cycling in one run. NASA/ESA pass/fail, charts, PDF export.', badge:'ASTM E595 · NASA MSFC · ESA ECSS', accent:'teal' },
  { href:'/type2',         icon:'⚡', title:'Type II Qualification',     desc:'SMILES → SpaceChem-AI + full spacecraft qual in one click. No other tool does this.', badge:'Novel · Type II Civilization Score', accent:'oc' },
  { href:'/orbit-comparison', icon:'🔭', title:'Orbit Comparison',      desc:'Same blend across LEO, GEO, ISS, lunar, deep space simultaneously. Find the right orbit instantly.', badge:'6 orbital environments', accent:'amber' },
  { href:'/outgassing',    icon:'📊', title:'Outgassing Screen',        desc:'ASTM E595 TML & CVCM prediction. Clausius-Clapeyron + Langmuir model at 125°C / 10⁻⁴ Pa.', badge:'TML ≤ 1.0% · CVCM ≤ 0.1%', accent:'white' },
  { href:'/radiation',     icon:'☢️', title:'Radiation Stability',      desc:'G-value polymer class + Harrington dose-response. LEO through deep space TID environments.', badge:'G-value · Harrington model', accent:'white' },
  { href:'/thermal',       icon:'🌡️', title:'Thermal Cycling',          desc:'Coffin-Manson fatigue life. CTE mismatch vs all substrate materials. NASA-STD-7001.', badge:'Coffin-Manson · CTE mismatch', accent:'white' },
  { href:'/spacechem',     icon:'🌌', title:'SpaceChem-AI',             desc:'ML screening for Dyson swarm / Type II civilization space solar. ExtraTrees R²=0.9959.', badge:'Bandgap · AM0 · Terafab', accent:'white' },
  { href:'/materials',     icon:'🗃️', title:'Materials DB',             desc:'38 space-qualified materials with VP, CTE, modulus, UTS. Sortable, searchable.', badge:'38 space-grade materials', accent:'white' },
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-oc2 border border-oc/25 px-3.5 py-1.5 rounded-sm bg-oc/6 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-oc animate-pulse" />
          OrbitChem™ v2.0 · Space Material Intelligence · ChemeNova LLC
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-light leading-[0.92] tracking-tight text-light mb-6">
          Chemistry<br />for the edge<br />of <em className="text-oc2 not-italic">everything.</em>
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-xl mb-8">
          AI-powered aerospace material qualification to NASA MSFC and ESA ECSS standards.
          From ASTM E595 outgassing to Type II Civilization space solar candidacy — free, open, one platform.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/qualification" className="btn-primary text-sm py-3 px-6">Run Qualification →</Link>
          <Link href="/type2"         className="btn-accent text-sm py-3 px-6">⚡ Type II Suite</Link>
          <Link href="/orbit-comparison" className="btn-secondary text-sm py-3 px-6">🔭 Orbit Compare</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          ['38','Space-grade materials'], ['ASTM E595','NASA MSFC-SPEC-1238'],
          ['R²=0.9959','SpaceChem-AI accuracy'], ['LEO → Deep Space','All orbital environments'],
        ].map(([v,l]) => (
          <div key={v} className="metric-card">
            <div className="font-mono font-bold text-teal text-base">{v}</div>
            <div className="text-[10px] font-mono uppercase tracking-wide text-muted mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="mb-3 text-[10px] font-mono tracking-[0.2em] uppercase text-teal">// Modules</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-14">
        {MODULES.map(m => (
          <Link key={m.href} href={m.href}
            className="group block card hover:-translate-y-0.5 transition-all duration-200 hover:border-teal/30">
            <div className="text-2xl mb-3">{m.icon}</div>
            <div className="font-semibold text-sm text-light group-hover:text-teal transition-colors mb-2">{m.title}</div>
            <div className="text-muted text-xs leading-relaxed mb-3">{m.desc}</div>
            <div className="text-[10px] font-mono text-teal/60">{m.badge}</div>
          </Link>
        ))}
      </div>

      {/* Paper */}
      <div className="border border-oc/20 bg-oc/4 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-oc2 mb-2">// Research preprint</div>
          <div className="font-serif text-xl text-light font-light leading-snug max-w-xl">
            OrbitChem: An Integrated ML and Physics-Based Platform<br className="hidden md:block" />
            for Space-Grade Molecular Design and Spacecraft Qualification
          </div>
          <div className="text-muted text-xs mt-1.5 font-mono">Shehan Makani · ChemeNova LLC · 2026 · ExtraTrees R²=0.9959</div>
        </div>
        <div className="flex gap-3 shrink-0">
          <a href="https://chemrxiv.org" target="_blank" className="btn-secondary text-xs py-2">ChemRxiv →</a>
          <a href="https://github.com/Cheme-Nova/OrbitChem" target="_blank" className="btn-secondary text-xs py-2">GitHub →</a>
        </div>
      </div>
    </div>
  )
}
