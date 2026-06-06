'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import type { BlendMap, OrbitEnv, Substrate, FullQualReport } from '@/lib/types'
import BlendBuilder, { DEFAULT_BLEND } from '@/components/blend-builder'
import { StatusBadge, RatingBadge, Spinner } from '@/components/qual-card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts'

const ORBITS: OrbitEnv[] = ['LEO','ISS','MEO','GEO','lunar','deep_space']
const LABELS: Record<OrbitEnv,string> = { LEO:'LEO (400km)', ISS:'ISS (408km)', MEO:'MEO (20Kkm)', GEO:'GEO (36Kkm)', lunar:'Lunar', deep_space:'Deep Space' }
const TT = { content: { background:'#12121A', border:'1px solid #1C2128', borderRadius:6, fontSize:11, color:'#F0F2F5' } }

type Row = { orbit: OrbitEnv; report: FullQualReport | null; error?: string }

export default function OrbitComparisonPage() {
  const [blend, setBlend]   = useState<BlendMap>(DEFAULT_BLEND)
  const [years, setYears]   = useState(5)
  const [sub, setSub]       = useState<Substrate>('aluminum')
  const [loading, setLoading] = useState(false)
  const [rows, setRows]     = useState<Row[]|null>(null)

  const total = Object.values(blend).reduce((a,b)=>a+b,0)
  const ready = Object.keys(blend).length > 0 && Math.abs(total-100) < 0.5

  async function compare() {
    setLoading(true); setRows(null)
    const results = await Promise.all(ORBITS.map(async orbit => {
      try { return { orbit, report: await api.fullQual(blend, orbit, years, sub) }
      } catch(e) { return { orbit, report: null, error: String(e) } }
    }))
    setRows(results); setLoading(false)
  }

  const passing = rows?.filter(r => {
    const qs = r.report?.qualification_summary
    return qs?.nasa_outgas_pass && ['excellent','good'].includes(qs?.radiation_rating??'') && qs?.thermal_pass
  }) ?? []

  const retentionData = rows?.filter(r=>r.report).map(r => ({
    orbit: LABELS[r.orbit],
    retention: r.report!.radiation.tensile_retention_pct,
    pass: ['excellent','good'].includes(r.report!.qualification_summary.radiation_rating),
  })) ?? []

  const safetyData = rows?.filter(r=>r.report).map(r => ({
    orbit: LABELS[r.orbit],
    safety: r.report!.thermal_cycling.safety_factor,
    pass: r.report!.qualification_summary.thermal_pass,
  })) ?? []

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="section-label">// Orbit Comparison</div>
        <h1 className="section-title">Same blend.<br /><em className="text-teal not-italic">Every orbit.</em></h1>
        <p className="text-muted text-sm mt-3 max-w-xl">Run your material blend through all 6 orbital environments simultaneously. Find where your material system qualifies — instantly.</p>
      </div>

      <div className="grid xl:grid-cols-4 gap-6">
        {/* Config */}
        <div className="space-y-4">
          <div className="card"><div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">Blend</div>
            <BlendBuilder value={blend} onChange={setBlend} />
          </div>
          <div className="card">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">Parameters</div>
            <div className="space-y-3">
              <div><label className="text-xs font-mono text-muted block mb-1">Duration: {years}yr</label>
                <input type="range" min={1} max={20} value={years} onChange={e=>setYears(+e.target.value)} className="w-full accent-teal" /></div>
              <div><label className="text-xs font-mono text-muted block mb-1">Substrate</label>
                <select className="select text-xs" value={sub} onChange={e=>setSub(e.target.value as Substrate)}>
                  {(['aluminum','titanium','carbon_fiber','invar']).map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select></div>
            </div>
          </div>
          <button onClick={compare} disabled={!ready||loading} className="btn-primary w-full justify-center py-3 text-sm">
            {loading ? <><Spinner size={14}/> Running 6 orbits…</> : '🔭 Compare All Orbits'}
          </button>
        </div>

        {/* Results */}
        <div className="xl:col-span-3 space-y-5">
          {!rows && !loading && (
            <div className="card py-24 flex flex-col items-center text-center">
              <div className="text-4xl mb-4">🔭</div>
              <div className="text-light font-semibold mb-2">Orbit comparison ready</div>
              <div className="text-muted text-sm max-w-xs">Configure your blend and run to see qualification results across all orbital environments in parallel.</div>
            </div>
          )}
          {loading && (
            <div className="card py-20 flex flex-col items-center gap-4">
              <Spinner size={40} />
              <div className="text-muted text-sm font-mono">Running {ORBITS.length} orbital environments in parallel…</div>
            </div>
          )}
          {rows && (
            <>
              {/* Verdict strip */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {rows.map(r => {
                  const qs = r.report?.qualification_summary
                  const all = qs?.nasa_outgas_pass && ['excellent','good'].includes(qs?.radiation_rating??'') && qs?.thermal_pass
                  const any = qs?.nasa_outgas_pass || ['excellent','good'].includes(qs?.radiation_rating??'') || qs?.thermal_pass
                  const color = all ? '#1D9E75' : any ? '#EF9F27' : '#E24B4A'
                  return (
                    <div key={r.orbit} className="text-center p-3 rounded-lg border" style={{borderColor:`${color}33`,background:`${color}08`}}>
                      <div className="text-xl mb-1">{all?'✅':any?'⚠️':'❌'}</div>
                      <div className="text-[10px] font-mono font-bold" style={{color}}>{LABELS[r.orbit]}</div>
                    </div>
                  )
                })}
              </div>

              {/* Recommendation */}
              {passing.length > 0 ? (
                <div className="p-4 rounded-lg border border-success/25 bg-success/5 font-mono text-sm text-success">
                  ✅ Recommended orbit{passing.length>1?'s':''}: <strong>{passing.map(r=>LABELS[r.orbit]).join(', ')}</strong> — all qualification criteria pass
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-warn/25 bg-warn/5 font-mono text-sm text-warn">
                  ⚠️ Blend fails full qualification in all orbits — review Smart Failure Analysis in the Full Qualification tab
                </div>
              )}

              {/* Tensile retention chart */}
              {retentionData.length > 0 && (
                <div className="card">
                  <div className="section-label">Tensile Retention by Orbit — {years}yr</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={retentionData}>
                      <XAxis dataKey="orbit" tick={{fontSize:10,fill:'#8A9099',fontFamily:'JetBrains Mono'}} />
                      <YAxis tick={{fontSize:10,fill:'#8A9099'}} domain={[0,105]} />
                      <Tooltip contentStyle={TT.content} formatter={(v)=>[`${(v as number)?.toFixed(1) ?? '0'}%`,'Tensile retention']} />
                      <ReferenceLine y={70} stroke="#EF9F27" strokeDasharray="4 2" label={{value:'70% limit',fontSize:8,fill:'#EF9F27',position:'right'}} />
                      <Bar dataKey="retention" radius={[4,4,0,0]}>
                        {retentionData.map((d,i)=><Cell key={i} fill={d.pass?'#0D9488':'#E24B4A'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Safety factor chart */}
              {safetyData.length > 0 && (
                <div className="card">
                  <div className="section-label">Thermal Safety Factor by Orbit — substrate: {sub}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={safetyData}>
                      <XAxis dataKey="orbit" tick={{fontSize:10,fill:'#8A9099',fontFamily:'JetBrains Mono'}} />
                      <YAxis tick={{fontSize:10,fill:'#8A9099'}} />
                      <Tooltip contentStyle={TT.content} formatter={(v)=>[`${(v as number)?.toFixed(1) ?? '0'}×`,'Safety factor']} />
                      <ReferenceLine y={2} stroke="#EF9F27" strokeDasharray="4 2" label={{value:'2× min',fontSize:8,fill:'#EF9F27',position:'right'}} />
                      <Bar dataKey="safety" radius={[4,4,0,0]}>
                        {safetyData.map((d,i)=><Cell key={i} fill={d.safety>=2?'#1D9E75':d.safety>=1?'#EF9F27':'#E24B4A'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Full table */}
              <div className="card overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="border-b border-white/8 text-muted">
                    {['Orbit','NASA','ESA','TID kRad','Radiation','Tensile%','Thermal','Safety'].map(h=>(
                      <th key={h} className="text-left py-2.5 pr-4 font-normal tracking-wide">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{rows.map(r => {
                    const qs = r.report?.qualification_summary
                    return (
                      <tr key={r.orbit} className="border-b border-white/4 hover:bg-white/2">
                        <td className="py-2.5 pr-4 text-light font-semibold">{LABELS[r.orbit]}</td>
                        <td className="py-2.5 pr-4">{qs ? <StatusBadge pass={qs.nasa_outgas_pass}/> : '—'}</td>
                        <td className="py-2.5 pr-4">{qs ? <StatusBadge pass={qs.esa_outgas_pass}/> : '—'}</td>
                        <td className="py-2.5 pr-4 text-oc2">{r.report?.radiation.total_tid_krad.toFixed(0) ?? '—'}</td>
                        <td className="py-2.5 pr-4">{qs ? <RatingBadge rating={qs.radiation_rating}/> : '—'}</td>
                        <td className="py-2.5 pr-4">{r.report?.radiation.tensile_retention_pct.toFixed(1) ?? '—'}%</td>
                        <td className="py-2.5 pr-4">{qs ? <StatusBadge pass={qs.thermal_pass}/> : '—'}</td>
                        <td className={`py-2.5 font-bold ${(r.report?.thermal_cycling.safety_factor??0)>=2?'text-success':(r.report?.thermal_cycling.safety_factor??0)>=1?'text-warn':'text-danger'}`}>
                          {r.report?.thermal_cycling.safety_factor.toFixed(1) ?? '—'}×
                        </td>
                      </tr>
                    )
                  })}</tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
