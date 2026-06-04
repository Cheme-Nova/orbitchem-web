'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { SpaceMaterial } from '@/lib/types'
import { Search } from 'lucide-react'
import { Spinner } from '@/components/qual-card'

type SortKey = keyof SpaceMaterial

export default function MaterialsPage() {
  const [mats, setMats]     = useState<SpaceMaterial[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [sort, setSort]     = useState<{k:SortKey;asc:boolean}>({k:'name',asc:true})

  useEffect(() => {
    api.materials('space').then(d=>{setMats(d.materials);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  const filtered = mats
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || (m.function??'').toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      const av=a[sort.k], bv=b[sort.k]
      if(av==null) return 1; if(bv==null) return -1
      return sort.asc ? (av<bv?-1:1) : (av>bv?-1:1)
    })

  function th(k: SortKey, label: string) {
    return (
      <th onClick={()=>setSort(s=>({k,asc:s.k===k?!s.asc:true}))}
          className="text-left py-3 pr-4 text-[10px] font-mono tracking-widest uppercase text-muted cursor-pointer hover:text-teal transition-colors whitespace-nowrap select-none">
        {label}{sort.k===k ? sort.asc?' ↑':' ↓' : ''}
      </th>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="section-label">// Materials Database</div>
          <h1 className="section-title">Space-Grade <em className="text-teal not-italic">Materials</em></h1>
          <p className="text-muted text-sm mt-2">{mats.length} qualified aerospace materials — VP, CTE, modulus, UTS. Sources: NASA MAPTIS, ESA ESMAT.</p>
        </div>
        <div className="relative w-full sm:w-72 shrink-0">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9 text-sm" placeholder="Search by name or function…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="card py-20 flex justify-center"><Spinner size={32}/></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="border-b border-white/8">
              <tr>
                {th('name','Material')} {th('function','Function')} {th('vp_kPa','VP (kPa)')}
                {th('cte_ppm_K','CTE ppm/K')} {th('modulus_GPa','E (GPa)')} {th('uts_MPa','UTS (MPa)')} {th('cost_usd_kg','$/kg')}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m,i) => (
                <tr key={i} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="py-2.5 pr-4 text-light font-semibold">{m.name}</td>
                  <td className="py-2.5 pr-4 text-muted">{m.function}</td>
                  <td className="py-2.5 pr-4 text-teal2">{m.vp_kPa!=null ? m.vp_kPa.toExponential(2) : '—'}</td>
                  <td className="py-2.5 pr-4">{m.cte_ppm_K!=null&&m.cte_ppm_K>0 ? m.cte_ppm_K.toFixed(1) : '—'}</td>
                  <td className="py-2.5 pr-4">{m.modulus_GPa!=null&&m.modulus_GPa>0 ? m.modulus_GPa.toFixed(2) : '—'}</td>
                  <td className="py-2.5 pr-4">{m.uts_MPa!=null&&m.uts_MPa>0 ? m.uts_MPa.toFixed(0) : '—'}</td>
                  <td className="py-2.5 text-amber">{m.cost_usd_kg!=null ? `$${m.cost_usd_kg.toFixed(0)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-3 text-muted text-[10px] font-mono">
            {filtered.length} of {mats.length} materials · Click column headers to sort
          </div>
        </div>
      )}
    </div>
  )
}
