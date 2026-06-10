'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import type { BomAuditReport, BomAuditRow } from '@/lib/types'
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight, ArrowRight, Loader2, Download, Printer } from 'lucide-react'

const DEMO_BOM = `Kapton HN
Hysol EA 9394
DC 93-500
3M Scotch-Weld 2216
PEEK
Polysulfide Sealant PR-1440
Carbon Fiber T300
Braycote 601EF
Sylgard 184
Aeroglaze Z306`

const RISK_COLOR: Record<string, string> = {
  low:      'text-success',
  medium:   'text-warn',
  high:     'text-orange-400',
  critical: 'text-danger',
  unknown:  'text-muted',
}

const RISK_BG: Record<string, string> = {
  low:      'bg-success/8 border-success/20',
  medium:   'bg-warn/8 border-warn/20',
  high:     'bg-orange-400/8 border-orange-400/20',
  critical: 'bg-danger/8 border-danger/20',
  unknown:  'bg-white/4 border-white/8',
}

function RowCard({ row }: { row: BomAuditRow }) {
  const [open, setOpen] = useState(false)
  const hasSubs = row.substitutions.length > 0
  const tmlStr  = row.tml_pct  != null ? row.tml_pct.toFixed(2)  + '%' : '—'
  const cvcmStr = row.cvcm_pct != null ? row.cvcm_pct.toFixed(3) + '%' : '—'
  const tmlFail  = row.tml_pct  != null && row.tml_pct  > 1.0
  const cvcmFail = row.cvcm_pct != null && row.cvcm_pct > 0.1

  return (
    <div className={`rounded-lg border ${row.nasa_pass ? 'bg-white/2 border-white/8' : RISK_BG[row.risk_level]}`}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => hasSubs && setOpen(o => !o)}
      >
        {/* Status icon */}
        <div className="shrink-0">
          {row.nasa_pass
            ? <CheckCircle size={15} className="text-success" />
            : <AlertTriangle size={15} className={RISK_COLOR[row.risk_level]} />}
        </div>

        {/* Material name */}
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-light truncate">{row.material}</div>
          {row.matched_name && row.matched_name !== row.material && (
            <div className="text-[10px] text-muted font-mono mt-0.5 truncate">→ {row.matched_name}</div>
          )}
          {!row.in_db && (
            <div className="text-[10px] text-warn font-mono mt-0.5">not in DB — conservative defaults used</div>
          )}
        </div>

        {/* Metrics */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-muted font-mono">TML</div>
            <div className={`text-xs font-mono font-bold ${tmlFail ? 'text-danger' : 'text-light'}`}>{tmlStr}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted font-mono">CVCM</div>
            <div className={`text-xs font-mono font-bold ${cvcmFail ? 'text-danger' : 'text-light'}`}>{cvcmStr}</div>
          </div>
          <div className="w-16 text-right">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              row.nasa_pass ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
            }`}>
              {row.nasa_pass ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <div className="shrink-0 text-muted">
          {hasSubs
            ? (open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>)
            : <div className="w-3.5"/>}
        </div>
      </div>

      {/* Mobile metrics */}
      <div className="sm:hidden flex items-center gap-4 px-4 pb-3">
        <span className="text-[10px] font-mono text-muted">TML <span className={tmlFail?'text-danger':'text-light'}>{tmlStr}</span></span>
        <span className="text-[10px] font-mono text-muted">CVCM <span className={cvcmFail?'text-danger':'text-light'}>{cvcmStr}</span></span>
        <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${row.nasa_pass?'bg-success/15 text-success':'bg-danger/15 text-danger'}`}>
          {row.nasa_pass ? 'PASS' : 'FAIL'}
        </span>
      </div>

      {/* Substitutions */}
      {open && hasSubs && (
        <div className="px-4 pb-4 border-t border-white/6 pt-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">Compliant substitutions</div>
          {row.substitutions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-success/6 border border-success/15 rounded px-3 py-2">
              <ArrowRight size={12} className="text-success shrink-0" />
              <div className="flex-1 font-mono text-xs text-light">{s.name}</div>
              <div className="flex gap-3 text-[10px] font-mono text-muted">
                <span>TML <span className="text-success">{s.tml_pct.toFixed(2)}%</span></span>
                <span>CVCM <span className="text-success">{s.cvcm_pct.toFixed(3)}%</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BomAuditPage() {
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport]   = useState<BomAuditReport | null>(null)
  const [error, setError]     = useState<string | null>(null)

  function loadDemo() {
    setInput(DEMO_BOM)
    setReport(null)
    setError(null)
  }

  async function run() {
    const materials = input.split('\n').map(l => l.trim()).filter(Boolean)
    if (!materials.length) return
    setLoading(true); setError(null); setReport(null)
    try { setReport(await api.bomAudit(materials)) }
    catch (e) { setError(String(e)) }
    finally { setLoading(false) }
  }

  function downloadCSV() {
    if (!report) return
    const header = ['Material', 'Matched Name', 'In DB', 'Function', 'TML %', 'CVCM %', 'NASA Pass', 'ESA Pass', 'Risk Level', 'Substitutions']
    const rows = report.audit.map(r => [
      r.material,
      r.matched_name ?? '',
      r.in_db ? 'yes' : 'no',
      r.function,
      r.tml_pct  != null ? r.tml_pct.toFixed(4)  : '',
      r.cvcm_pct != null ? r.cvcm_pct.toFixed(4) : '',
      r.nasa_pass ? 'PASS' : 'FAIL',
      r.esa_pass  ? 'PASS' : 'FAIL',
      r.risk_level,
      r.substitutions.map(s => `${s.name} (TML ${s.tml_pct.toFixed(2)}%, CVCM ${s.cvcm_pct.toFixed(3)}%)`).join('; '),
    ])
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `orbitchem-bom-audit-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const s = report?.summary
  const failures = report?.audit.filter(r => !r.nasa_pass) ?? []
  const passes   = report?.audit.filter(r =>  r.nasa_pass) ?? []

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="section-label">// BOM Audit</div>
        <h1 className="section-title">Material <em className="text-teal not-italic">BOM Audit</em></h1>
        <p className="text-muted text-sm mt-2 max-w-xl">
          Paste your bill of materials — one material per line. Each is screened individually against
          NASA MSFC-SPEC-1238 and ESA ECSS-Q-ST-70-02 outgassing limits. Failures get ranked substitution suggestions.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* Input panel */}
        <div className="lg:col-span-2 space-y-3 print:hidden">
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">Materials list</div>
              <button onClick={loadDemo} className="text-[10px] font-mono text-teal hover:text-teal2 transition-colors">
                Load CubeSat demo →
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"Kapton HN\nHysol EA 9394\nDC 93-500\n..."}
              rows={14}
              className="w-full bg-navy/60 border border-white/8 rounded text-xs font-mono text-light placeholder-muted/40 p-3 resize-none focus:outline-none focus:border-teal/40 transition-colors"
            />
            <div className="text-[10px] text-muted font-mono">
              {input.split('\n').filter(l=>l.trim()).length} materials · up to 50
            </div>
          </div>
          <button
            onClick={run}
            disabled={!input.trim() || loading}
            className="btn-primary w-full justify-center py-3 text-sm"
          >
            {loading ? <><Loader2 size={14} className="animate-spin"/>Auditing…</> : '🔬 Run BOM Audit'}
          </button>
          {error && (
            <div className="card border-danger/20 bg-danger/5 text-danger text-xs font-mono flex gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5"/>{error}
            </div>
          )}

          {/* Limits reference */}
          <div className="card space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">ASTM E595 limits</div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted">TML (NASA / ESA)</span>
              <span className="text-light">≤ 1.0%</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted">CVCM (NASA / ESA)</span>
              <span className="text-light">≤ 0.1%</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted">VCM (ESA only)</span>
              <span className="text-light">≤ 0.1%</span>
            </div>
            <div className="text-[10px] text-muted font-mono mt-2 leading-relaxed">
              Test conditions: 125°C, 24h, 10⁻⁴ Pa vacuum (ASTM E595).
              Predictions use measured values from NASA outgassing DB where available.
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 print:col-span-5 print:max-w-full space-y-4">
          {!report && !loading && (
            <div className="card py-28 flex flex-col items-center text-center">
              <div className="text-4xl mb-4">🔬</div>
              <div className="text-light font-semibold mb-2">Ready to audit</div>
              <div className="text-muted text-sm max-w-xs">
                Paste your material list or load the CubeSat demo to see how OrbitChem flags qualification failures before they reach the test lab.
              </div>
            </div>
          )}

          {loading && (
            <div className="card py-24 flex flex-col items-center gap-4">
              <Loader2 size={36} className="animate-spin text-teal" />
              <div className="text-muted text-xs font-mono">Screening against NASA/ESA outgassing limits…</div>
            </div>
          )}

          {report && s && (
            <>
              {/* Export actions */}
              <div className="flex items-center justify-end gap-2 print:hidden">
                <button onClick={downloadCSV} className="btn-accent text-[11px] py-1.5 px-3 inline-flex items-center gap-1.5">
                  <Download size={12}/> Export CSV
                </button>
                <button onClick={() => window.print()} className="btn-accent text-[11px] py-1.5 px-3 inline-flex items-center gap-1.5">
                  <Printer size={12}/> Print / PDF
                </button>
              </div>

              {/* Print header */}
              <div className="hidden print:block mb-2">
                <div className="text-lg font-bold">OrbitChem — BOM Audit Report</div>
                <div className="text-xs">{new Date().toLocaleString()} · {s.total} materials · {s.pass} pass / {s.fail} fail / {s.critical} critical</div>
              </div>

              {/* Summary bar */}
              <div className={`flex items-center gap-3 p-4 rounded-lg border ${
                s.fail === 0
                  ? 'border-success/25 bg-success/5'
                  : 'border-danger/25 bg-danger/5'
              }`}>
                {s.fail === 0
                  ? <CheckCircle size={18} className="text-success shrink-0"/>
                  : <AlertTriangle size={18} className="text-danger shrink-0"/>}
                <div className="flex-1">
                  <div className={`font-mono font-bold text-sm ${s.fail===0?'text-success':'text-danger'}`}>
                    {s.fail === 0
                      ? 'ALL MATERIALS PASS — PROCEED TO DESIGN LOCK'
                      : `${s.fail} OF ${s.total} MATERIALS FAIL — REVIEW BEFORE DESIGN LOCK`}
                  </div>
                  <div className="text-muted text-xs font-mono mt-0.5">
                    {s.pass} pass · {s.fail} fail · {s.critical} critical
                  </div>
                </div>
              </div>

              {/* Stat chips */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Total',    val: s.total,    color: 'text-light'   },
                  { label: 'Pass',     val: s.pass,     color: 'text-success' },
                  { label: 'Fail',     val: s.fail,     color: 'text-danger'  },
                  { label: 'Critical', val: s.critical, color: 'text-danger'  },
                ].map(c => (
                  <div key={c.label} className="card text-center py-3">
                    <div className={`text-2xl font-mono font-bold ${c.color}`}>{c.val}</div>
                    <div className="text-[10px] font-mono text-muted uppercase tracking-widest mt-1">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Failures first */}
              {failures.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-danger/80 flex items-center gap-2">
                    <AlertTriangle size={10}/> Failures — click to see substitutions
                  </div>
                  {failures.map((row, i) => <RowCard key={i} row={row} />)}
                </div>
              )}

              {/* Passes */}
              {passes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-success/80 flex items-center gap-2">
                    <CheckCircle size={10}/> Compliant materials
                  </div>
                  {passes.map((row, i) => <RowCard key={i} row={row} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
