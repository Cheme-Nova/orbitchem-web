'use client'
import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import type { BlendMap } from '@/lib/types'

export const SPACE_MATERIALS = [
  'Kapton HN (Polyimide Film)','Aluminized Kapton (MLI)',
  'PICA Ablator (Phenolic Carbon)','Carbon Phenolic (Ablative)',
  'EPDM Cork Composite (Ablative)','Hysol EA 9394 (Structural Epoxy)',
  'Hysol EA 9309.3NA (Low-Outgas Epoxy)','3M AF 163-2 (Film Adhesive)',
  'Araldite AW106/HV953U (Epoxy)','RTV 566 (Silicone Adhesive)',
  '3M Scotch-Weld 2216 (Flexible Epoxy)','DC 93-500 (Silicone Potting)',
  'Sylgard 184 (PDMS Elastomer)','Epo-Tek 301-2 (Optical Epoxy)',
  'Stycast 2850FT (Thermally Conductive Epoxy)',
  'Braycote 601EF (PFPE Grease)','Krytox 143AZ (PFPE Oil)','Fomblin Z-25 (PFPE Oil)',
  'MoS2 Dry Film Lubricant','WS2 Dry Film Lubricant',
  'PTFE (Teflon)','FEP (Fluorinated Ethylene Propylene)',
  'PEEK (Polyetheretherketone)','PEKK (Polyetherketoneketone)',
  'Ultem 9085 (Polyetherimide)','BMI 5250-4 (Bismaleimide Resin)',
  'RS-3 Cyanate Ester','CYCOM 5320-1 (OOA Epoxy Prepreg)',
  'Carbon Fiber T300 (Reinforcement)','Polysulfide Sealant PR-1440',
  'Z-93-P55 White Thermal Control Paint','Aeroglaze A276 (Polyurethane Topcoat)',
  'Aeroglaze Z306 (Flat Black Coating)','Silver Teflon Tape (OSR)',
  'Chotherm 1671 (Silicone TIM)','Indium Foil (Metallic TIM)',
  'Silica Aerogel (Super-Insulation)','Silicon Carbide (SiC Ceramic)',
]

export const DEFAULT_BLEND: BlendMap = {
  'Kapton HN (Polyimide Film)': 60,
  'Hysol EA 9394 (Structural Epoxy)': 30,
  'DC 93-500 (Silicone Potting)': 10,
}

const QUICK_PICKS = [
  'Kapton HN (Polyimide Film)', 'Hysol EA 9394 (Structural Epoxy)',
  'Braycote 601EF (PFPE Grease)', 'PEEK (Polyetheretherketone)',
  'DC 93-500 (Silicone Potting)', 'PICA Ablator (Phenolic Carbon)',
]

export default function BlendBuilder({ value, onChange }: { value: BlendMap; onChange: (b: BlendMap) => void }) {
  type Row = { mat: string; pct: number }
  const [rows, setRows] = useState<Row[]>(() => Object.entries(value).map(([mat, pct]) => ({ mat, pct })))

  useEffect(() => {
    const b: BlendMap = {}
    rows.forEach(r => { if (r.mat) b[r.mat] = r.pct })
    onChange(b)
  }, [rows]) // eslint-disable-line

  const total = rows.reduce((s, r) => s + (r.pct || 0), 0)
  const ok = Math.abs(total - 100) < 0.5

  const upd = (i: number, field: keyof Row, val: string | number) =>
    setRows(rs => rs.map((r, j) => j === i ? { ...r, [field]: val } : r))

  return (
    <div className="space-y-3">
      <div>
        <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Quick add</div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PICKS.map(m => (
            <button key={m} onClick={() => setRows(rs => [...rs, { mat: m, pct: 0 }])}
              className="text-[10px] font-mono px-2 py-1 rounded bg-surface2 border border-white/8 text-muted hover:text-teal hover:border-teal/30 transition-all">
              +{m.split('(')[0].trim().slice(0, 18)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select value={r.mat} onChange={e => upd(i, 'mat', e.target.value)} className="select flex-1 text-xs">
              <option value="">Select material…</option>
              {SPACE_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="number" min={0.1} max={100} step={0.5} value={r.pct}
              onChange={e => upd(i, 'pct', parseFloat(e.target.value) || 0)}
              className="input w-20 text-center text-xs font-mono" />
            <span className="text-muted text-xs font-mono shrink-0">%</span>
            <button onClick={() => setRows(rs => rs.filter((_, j) => j !== i))} className="text-muted hover:text-danger transition-colors p-1 shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setRows(rs => [...rs, { mat: '', pct: 0 }])}
          className="flex items-center gap-1.5 text-xs font-mono text-muted border border-dashed border-white/15 px-3 py-1.5 rounded hover:text-teal hover:border-teal/30 transition-all">
          <Plus size={12} /> Add material
        </button>
        <span className={`text-xs font-mono font-bold ${ok ? 'text-success' : 'text-danger'}`}>
          {ok ? '✓' : '✗'} {total.toFixed(1)}% {!ok && `(${total > 100 ? '' : '+'}${(100 - total).toFixed(1)} to reach 100)`}
        </span>
      </div>
    </div>
  )
}
