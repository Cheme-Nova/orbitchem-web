'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import type { BlendMap, FullQualReport, OrbitEnv, Substrate } from '@/lib/types'
import BlendBuilder, { DEFAULT_BLEND } from '@/components/blend-builder'
import { QualCard, StatusBadge, RatingBadge, Spinner } from '@/components/qual-card'
import { Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'

const ORBITS: {v:OrbitEnv;l:string}[] = [
  {v:'LEO',l:'LEO (400–600 km)'},{v:'GEO',l:'GEO (35,786 km)'},
  {v:'ISS',l:'ISS (408 km)'},{v:'lunar',l:'Lunar'},{v:'deep_space',l:'Deep Space'},{v:'MEO',l:'MEO'},
]
const SUBS: {v:Substrate;l:string}[] = [
  {v:'aluminum',l:'Aluminum (23 ppm/K)'},{v:'titanium',l:'Titanium (8.6 ppm/K)'},
  {v:'carbon_fiber',l:'Carbon Fiber (1.0 ppm/K)'},{v:'invar',l:'Invar (1.2 ppm/K)'},
  {v:'silicon',l:'Silicon (2.6 ppm/K)'},{v:'steel',l:'Steel (11 ppm/K)'},
]
const TT = { content: { background:'#12121A', border:'1px solid #1C2128', borderRadius:6, fontSize:11, color:'#F0F2F5' } }
const RC = { low:'#1D9E75', medium:'#EF9F27', high:'#E24B4A', critical:'#7c0000' }

export default function QualPage() {
  const [blend, setBlend]       = useState<BlendMap>(DEFAULT_BLEND)
  const [orbit, setOrbit]       = useState<OrbitEnv>('LEO')
  const [years, setYears]       = useState(5)
  const [sub, setSub]           = useState<Substrate>('aluminum')
  const [loading, setLoading]   = useState(false)
  const [report, setReport]     = useState<FullQualReport|null>(null)
  const [error, setError]       = useState<string|null>(null)

  const total = Object.values(blend).reduce((a,b)=>a+b,0)
  const ready = Object.keys(blend).length > 0 && Math.abs(total-100) < 0.5

  async function run() {
    setLoading(true); setError(null)
    try { setReport(await api.fullQual(blend, orbit, years, sub)) }
    catch(e) { setError(String(e)) }
    finally { setLoading(false) }
  }

  function exportJSON() {
    if (!report) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify({blend,orbit,years,sub,report},null,2)], {type:'application/json'}))
    a.download = `orbitchem_${orbit}_${new Date().toISOString().slice(0,10)}.json`; a.click()
  }

  const qs = report?.qualification_summary

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="section-label">// Full Qualification Suite</div>
        <h1 className="section-title">Spacecraft Material <em className="text-teal not-italic">Qualification</em></h1>
        <p className="text-muted text-sm mt-2 max-w-lg">Outgassing (ASTM E595) + radiation (G-value/Harrington) + thermal cycling (Coffin-Manson) in one run.</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Config */}
        <div className="space-y-4">
          <div className="card"><div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">Blend</div>
            <BlendBuilder value={blend} onChange={setBlend} />
          </div>
          <div className="card">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">Mission profile</div>
            <div className="space-y-3">
              <div><label className="text-xs font-mono text-muted block mb-1">Orbit</label>
                <select className="select text-xs" value={orbit} onChange={e=>setOrbit(e.target.value as OrbitEnv)}>
                  {ORBITS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-mono text-muted block mb-1">Duration: {years} yr</label>
                <input type="range" min={1} max={20} step={0.5} value={years} onChange={e=>setYears(+e.target.value)} className="w-full accent-teal" />
              </div>
              <div><label className="text-xs font-mono text-muted block mb-1">Substrate</label>
                <select className="select text-xs" value={sub} onChange={e=>setSub(e.target.value as Substrate)}>
                  {SUBS.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
              </div>
            </div>
          </div>
          <button onClick={run} disabled={!ready||loading} className="btn-primary w-full justify-center py-3 text-sm">
            {loading ? <><Spinner size={14}/> Running…</> : '⚗️ Run Full Qualification'}
          </button>
          {error && <div className="card border-danger/20 bg-danger/5 text-danger text-xs font-mono flex gap-2"><AlertTriangle size={14}/>{error}</div>}
        </div>

        {/* Results */}
        <div className="xl:col-span-2 space-y-4">
          {!report && !loading && (
            <div className="card py-24 flex flex-col items-center text-center">
              <div className="text-4xl mb-4">🛰️</div>
              <div className="text-light font-semibold mb-2">Ready to qualify</div>
              <div className="text-muted text-sm max-w-xs">Configure your material blend and mission profile, then run the full qualification suite.</div>
            </div>
          )}
          {loading && (
            <div className="card py-20 flex flex-col items-center gap-5">
              <Spinner size={40} />
              <div className="text-center space-y-1.5">
                {['Clausius-Clapeyron vapour pressure extrapolation','G-value polymer class + Harrington dose-response','Coffin-Manson Nf + CTE mismatch delamination'].map(s=>(
                  <div key={s} className="text-muted text-xs font-mono">{s}</div>
                ))}
              </div>
            </div>
          )}
          {report && qs && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QualCard label="NASA Outgas" value={qs.nasa_outgas_pass?'PASS':'FAIL'} sub={`TML ${report.outgassing.blend_tml_pct.toFixed(4)}%`} status={qs.nasa_outgas_pass?'pass':'fail'} />
                <QualCard label="ESA Outgas"  value={qs.esa_outgas_pass ?'PASS':'FAIL'} sub={`CVCM ${report.outgassing.blend_cvcm_pct.toFixed(5)}%`} status={qs.esa_outgas_pass?'pass':'fail'} />
                <QualCard label="Radiation"   value={qs.radiation_rating.toUpperCase()} sub={`${report.radiation.tensile_retention_pct.toFixed(0)}% tensile`} status={['excellent','good'].includes(qs.radiation_rating)?'pass':qs.radiation_rating==='marginal'?'warn':'fail'} />
                <QualCard label="Thermal"     value={qs.thermal_pass?'PASS':'FAIL'} sub={`Safety ${report.thermal_cycling.safety_factor.toFixed(1)}×`} status={qs.thermal_pass?'pass':'fail'} />
              </div>

              {/* Verdict */}
              {(() => {
                const all = qs.nasa_outgas_pass && ['excellent','good'].includes(qs.radiation_rating) && qs.thermal_pass
                return (
                  <div className={`flex items-center gap-3 p-4 rounded-lg border ${all?'border-success/25 bg-success/5':'border-warn/25 bg-warn/5'}`}>
                    {all ? <CheckCircle className="text-success shrink-0" size={18}/> : <AlertTriangle className="text-warn shrink-0" size={18}/>}
                    <div className="flex-1">
                      <div className={`font-mono font-bold text-sm ${all?'text-success':'text-warn'}`}>
                        {all ? 'FULL QUALIFICATION PASS — PROCEED TO LAB TESTING' : 'CONDITIONAL — REVIEW FLAGGED ITEMS'}
                      </div>
                      <div className="text-muted text-xs font-mono mt-0.5">{orbit} · {years}yr · {sub} · {Object.keys(blend).length} materials</div>
                    </div>
                    <button onClick={exportJSON} className="btn-secondary text-xs py-1.5 shrink-0"><Download size={12}/>JSON</button>
                  </div>
                )
              })()}

              {/* Outgassing chart */}
              <div className="card">
                <div className="section-label">Outgassing — ASTM E595</div>
                <div className="flex gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2"><span className="text-xs text-muted font-mono">TML</span><span className="font-mono font-bold text-sm text-light">{report.outgassing.blend_tml_pct.toFixed(4)}%</span><StatusBadge pass={report.outgassing.blend_tml_pct<=1.0} label="≤1.0%"/></div>
                  <div className="flex items-center gap-2"><span className="text-xs text-muted font-mono">CVCM</span><span className="font-mono font-bold text-sm text-light">{report.outgassing.blend_cvcm_pct.toFixed(5)}%</span><StatusBadge pass={report.outgassing.blend_cvcm_pct<=0.1} label="≤0.1%"/></div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={report.outgassing.records.map(r=>({name:r.ingredient.split('(')[0].trim().slice(0,18),TML:r.tml_contribution_pct,risk:r.risk_level}))}>
                    <XAxis dataKey="name" tick={{fontSize:9,fill:'#8A9099',fontFamily:'JetBrains Mono'}} />
                    <YAxis tick={{fontSize:9,fill:'#8A9099'}} />
                    <Tooltip contentStyle={TT.content} />
                    <ReferenceLine y={1.0} stroke="#E24B4A" strokeDasharray="4 2" label={{value:'NASA 1.0%',fontSize:8,fill:'#E24B4A',position:'right'}} />
                    <Bar dataKey="TML" radius={[3,3,0,0]}>
                      {report.outgassing.records.map((r,i)=><Cell key={i} fill={RC[r.risk_level as keyof typeof RC]??'#0D9488'}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {report.outgassing.warnings.map((w,i)=><div key={i} className="text-warn text-xs font-mono mt-1.5 flex gap-2"><span>⚠</span>{w}</div>)}
              </div>

              {/* Radiation table */}
              <div className="card">
                <div className="section-label">Radiation — {orbit} {years}yr ({report.radiation.total_tid_krad.toFixed(0)} kRad)</div>
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <RatingBadge rating={report.radiation.overall_rating}/>
                  <span className="text-muted text-xs font-mono">Tensile: <strong className="text-light">{report.radiation.tensile_retention_pct.toFixed(1)}%</strong></span>
                  <span className="text-muted text-xs font-mono">YI: <strong className="text-light">{report.radiation.yellowing_index.toFixed(2)}</strong></span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead><tr className="text-muted border-b border-white/8">
                      {['Material','Class','G(S)','G(X)','Net G','Tensile%','Rating'].map(h=><th key={h} className="text-left py-2 pr-3 font-normal tracking-wide">{h}</th>)}
                    </tr></thead>
                    <tbody>{report.radiation.records.map((r,i)=>(
                      <tr key={i} className="border-b border-white/4 hover:bg-white/2">
                        <td className="py-2 pr-3 text-light">{r.ingredient.split('(')[0].trim().slice(0,22)}</td>
                        <td className="py-2 pr-3 text-muted">{r.polymer_class}</td>
                        <td className="py-2 pr-3">{r.G_scission.toFixed(1)}</td>
                        <td className="py-2 pr-3">{r.G_crosslink.toFixed(1)}</td>
                        <td className={`py-2 pr-3 font-bold ${r.net_G<0?'text-success':r.net_G<1?'text-warn':'text-danger'}`}>{r.net_G.toFixed(2)}</td>
                        <td className="py-2 pr-3">{(r.dose_response*100).toFixed(1)}%</td>
                        <td className="py-2"><RatingBadge rating={r.rad_hardness}/></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                {report.radiation.recommendations.map((rec,i)=><div key={i} className="text-teal text-xs font-mono mt-1.5 flex gap-2"><span>💡</span>{rec}</div>)}
              </div>

              {/* Thermal */}
              <div className="card">
                <div className="section-label">Thermal Cycling — Coffin-Manson</div>
                <div className="flex flex-wrap gap-4 mb-3">
                  <StatusBadge pass={report.thermal_cycling.blend_passes}/>
                  <span className="text-muted text-xs font-mono">Safety: <strong className="text-light">{report.thermal_cycling.safety_factor.toFixed(2)}×</strong></span>
                  <span className="text-muted text-xs font-mono">ΔT: <strong className="text-light">{report.thermal_cycling.delta_T.toFixed(0)}°C</strong></span>
                  <span className="text-muted text-xs font-mono">CTE: <strong className="text-light">{report.thermal_cycling.blend_cte_ppm_K.toFixed(1)} ppm/K</strong></span>
                  <span className="text-muted text-xs font-mono">Cycles: <strong className="text-light">{report.thermal_cycling.total_cycles.toLocaleString()}</strong></span>
                </div>
                {report.thermal_cycling.recommendations.map((r,i)=><div key={i} className="text-teal text-xs font-mono mb-1 flex gap-2"><span>💡</span>{r}</div>)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
