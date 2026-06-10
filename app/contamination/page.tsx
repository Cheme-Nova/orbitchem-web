'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import type { ContaminationResult } from '@/lib/types'
import { AlertTriangle, Loader2, CloudFog } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const TT = { content: { background:'#12121A', border:'1px solid #1C2128', borderRadius:6, fontSize:11, color:'#F0F2F5' } }

const RISK_COLOR: Record<string, string> = {
  low: '#1D9E75', medium: '#EF9F27', high: '#F59E0B', critical: '#E24B4A',
}
const RISK_LABEL: Record<string, string> = {
  low: 'text-success', medium: 'text-warn', high: 'text-orange-400', critical: 'text-danger',
}
const RISK_BG: Record<string, string> = {
  low: 'bg-success/8 border-success/20', medium: 'bg-warn/8 border-warn/20',
  high: 'bg-orange-400/8 border-orange-400/20', critical: 'bg-danger/8 border-danger/20',
}

const DEMOS = ['Sylgard 184', 'Braycote 601EF', 'DC 93-500', 'PTFE', 'Kapton HN']

export default function ContaminationPage() {
  const [material, setMaterial]   = useState('Sylgard 184')
  const [sourceArea, setSourceArea] = useState(50)
  const [distance, setDistance]   = useState(10)
  const [tSource, setTSource]     = useState(40)
  const [tOptic, setTOptic]       = useState(20)
  const [years, setYears]         = useState(3)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<ContaminationResult | null>(null)
  const [error, setError]         = useState<string | null>(null)

  async function run() {
    if (!material.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      setResult(await api.contaminationProximity({
        material: material.trim(),
        source_area_cm2: sourceArea,
        distance_cm: distance,
        T_source_C: tSource,
        T_optic_C: tOptic,
        mission_years: years,
      }))
    } catch (e) { setError(String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="section-label">// Contamination Proximity</div>
        <h1 className="section-title">Molecular <em className="text-teal not-italic">Contamination</em> Proximity</h1>
        <p className="text-muted text-sm mt-2 max-w-xl">
          Estimate how much molecular film from an outgassing material deposits on a nearby
          optic or sensor over the mission life — screened against MIL-STD-1246C cleanliness levels.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* Config panel */}
        <div className="lg:col-span-2 space-y-3">
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">Source material</div>
            </div>
            <input
              value={material}
              onChange={e => setMaterial(e.target.value)}
              placeholder="e.g. Sylgard 184"
              className="w-full bg-navy/60 border border-white/8 rounded text-xs font-mono text-light placeholder-muted/40 px-3 py-2 focus:outline-none focus:border-teal/40 transition-colors"
            />
            <div className="flex flex-wrap gap-1.5">
              {DEMOS.map(m => (
                <button key={m} onClick={() => setMaterial(m)}
                  className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${
                    material === m ? 'border-teal/40 text-teal bg-teal/10' : 'border-white/8 text-muted hover:text-light hover:border-white/20'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="card space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted">Geometry &amp; thermal</div>

            <div>
              <label className="text-xs font-mono text-muted flex justify-between mb-1">
                <span>Source area</span><span className="text-light">{sourceArea} cm²</span>
              </label>
              <input type="range" min={1} max={500} value={sourceArea} onChange={e=>setSourceArea(+e.target.value)} className="w-full accent-teal" />
            </div>

            <div>
              <label className="text-xs font-mono text-muted flex justify-between mb-1">
                <span>Distance to optic</span><span className="text-light">{distance} cm</span>
              </label>
              <input type="range" min={1} max={100} value={distance} onChange={e=>setDistance(+e.target.value)} className="w-full accent-teal" />
            </div>

            <div>
              <label className="text-xs font-mono text-muted flex justify-between mb-1">
                <span>Source temperature</span><span className="text-light">{tSource}°C</span>
              </label>
              <input type="range" min={-50} max={120} value={tSource} onChange={e=>setTSource(+e.target.value)} className="w-full accent-teal" />
            </div>

            <div>
              <label className="text-xs font-mono text-muted flex justify-between mb-1">
                <span>Optic temperature</span><span className="text-light">{tOptic}°C</span>
              </label>
              <input type="range" min={-50} max={120} value={tOptic} onChange={e=>setTOptic(+e.target.value)} className="w-full accent-teal" />
            </div>

            <div>
              <label className="text-xs font-mono text-muted flex justify-between mb-1">
                <span>Mission duration</span><span className="text-light">{years} yr</span>
              </label>
              <input type="range" min={1} max={15} value={years} onChange={e=>setYears(+e.target.value)} className="w-full accent-teal" />
            </div>
          </div>

          <button onClick={run} disabled={!material.trim() || loading} className="btn-primary w-full justify-center py-3 text-sm">
            {loading ? <><Loader2 size={14} className="animate-spin"/>Calculating…</> : '☁️ Run Contamination Estimate'}
          </button>

          {error && (
            <div className="card border-danger/20 bg-danger/5 text-danger text-xs font-mono flex gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5"/>{error}
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 space-y-4">
          {!result && !loading && (
            <div className="card py-28 flex flex-col items-center text-center">
              <div className="text-4xl mb-4">☁️</div>
              <div className="text-light font-semibold mb-2">Ready to estimate</div>
              <div className="text-muted text-sm max-w-xs">
                Pick a material and adjust the geometry — the model predicts cumulative molecular
                film deposition on the nearby optic over the mission life.
              </div>
            </div>
          )}

          {loading && (
            <div className="card py-24 flex flex-col items-center gap-4">
              <Loader2 size={36} className="animate-spin text-teal" />
              <div className="text-muted text-xs font-mono">Running exponential depletion model…</div>
            </div>
          )}

          {result && (
            <>
              {/* Verdict */}
              <div className={`flex items-center gap-3 p-4 rounded-lg border ${RISK_BG[result.risk]}`}>
                <CloudFog size={18} className={`shrink-0 ${RISK_LABEL[result.risk]}`}/>
                <div className="flex-1">
                  <div className={`font-mono font-bold text-sm ${RISK_LABEL[result.risk]}`}>
                    {result.total_deposited_ng_cm2.toFixed(1)} ng/cm² over {result.mission_years}yr — {result.risk.toUpperCase()} risk
                  </div>
                  <div className="text-muted text-xs font-mono mt-0.5">
                    {result.mil_std_level}
                  </div>
                </div>
              </div>

              {result.matched_name && result.matched_name !== result.material && (
                <div className="text-[10px] text-muted font-mono">→ matched: {result.matched_name}</div>
              )}
              {!result.in_db && (
                <div className="text-[10px] text-warn font-mono">&apos;{result.material}&apos; not in DB — conservative defaults used</div>
              )}

              {/* Stat chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Total deposited',  val: `${result.total_deposited_ng_cm2.toFixed(1)} ng/cm²` },
                  { label: 'Avg. rate',         val: `${result.avg_rate_ng_cm2_yr.toFixed(1)} ng/cm²/yr` },
                  { label: 'Transmission loss', val: `${result.transmission_loss_pct.toFixed(2)}%` },
                  { label: 'τ (depletion)',     val: `${result.tau_days.toFixed(0)} days` },
                  { label: 'Volatile pool',     val: `${result.volatile_pool_ng_cm2.toFixed(0)} ng/cm²` },
                  { label: 'Sticking coeff.',   val: result.sticking_coeff.toFixed(2) },
                  { label: 'TML (material)',    val: `${result.tml_pct.toFixed(2)}%` },
                  { label: 'View factor dist.', val: `${result.distance_cm} cm` },
                ].map(c => (
                  <div key={c.label} className="card text-center py-3">
                    <div className="text-sm font-mono font-bold text-light">{c.val}</div>
                    <div className="text-[10px] font-mono text-muted uppercase tracking-widest mt-1">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Yearly cumulative chart */}
              {result.yearly_cumulative.length > 1 && (
                <div className="card">
                  <div className="section-label">Cumulative Deposition — {result.material}</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={result.yearly_cumulative}>
                      <XAxis dataKey="year" tick={{fontSize:10,fill:'#8A9099',fontFamily:'JetBrains Mono'}}
                        label={{value:'Mission year',fontSize:10,fill:'#8A9099',position:'insideBottom',offset:-2}} />
                      <YAxis tick={{fontSize:10,fill:'#8A9099'}}
                        label={{value:'ng/cm²',fontSize:10,fill:'#8A9099',angle:-90,position:'insideLeft'}} />
                      <Tooltip contentStyle={TT.content} formatter={(v)=>[`${(v as number)?.toFixed(1) ?? '0'} ng/cm²`,'Deposited']} />
                      <ReferenceLine y={75} stroke="#1D9E75" strokeDasharray="4 2" label={{value:'Level 100',fontSize:8,fill:'#1D9E75',position:'right'}} />
                      <ReferenceLine y={200} stroke="#EF9F27" strokeDasharray="4 2" label={{value:'Level 200',fontSize:8,fill:'#EF9F27',position:'right'}} />
                      <Area type="monotone" dataKey="deposited_ng_cm2" stroke={RISK_COLOR[result.risk]} fill={RISK_COLOR[result.risk]} fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="card space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-warn flex items-center gap-2">
                    <AlertTriangle size={10}/> Warnings
                  </div>
                  {result.warnings.map((w, i) => (
                    <div key={i} className="text-xs font-mono text-light/90 leading-relaxed">• {w}</div>
                  ))}
                </div>
              )}

              {/* Assumptions */}
              <div className="card space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted">Model assumptions</div>
                {result.assumptions.map((a, i) => (
                  <div key={i} className="text-[11px] font-mono text-muted leading-relaxed">• {a}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
