import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

type Status = 'pass' | 'fail' | 'warn' | 'info' | null

export function QualCard({ label, value, sub, status }: {
  label: string; value: string; sub?: string; status?: Status
}) {
  const border = { pass:'border-success/25 bg-success/5', fail:'border-danger/25 bg-danger/5', warn:'border-warn/25 bg-warn/5', info:'border-oc/25 bg-oc/5', null:'border-white/8 bg-[#0A1628]/50' }
  const text   = { pass:'text-success', fail:'text-danger', warn:'text-warn', info:'text-oc2', null:'text-light' }
  const Icon   = status === 'pass' ? CheckCircle : status === 'fail' ? XCircle : status === 'warn' ? AlertTriangle : null
  return (
    <div className={clsx('metric-card border', border[status ?? 'null'])}>
      <div className="text-[10px] font-mono tracking-widest uppercase text-muted mb-2">{label}</div>
      <div className={clsx('font-mono font-bold text-xl leading-none flex items-center gap-1.5', text[status ?? 'null'])}>
        {Icon && <Icon size={14} />}{value}
      </div>
      {sub && <div className="text-[11px] font-mono text-muted mt-1.5">{sub}</div>}
    </div>
  )
}

export function StatusBadge({ pass, label }: { pass: boolean; label?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border',
      pass ? 'bg-success/10 text-success border-success/25' : 'bg-danger/10 text-danger border-danger/25')}>
      {pass ? <CheckCircle size={9}/> : <XCircle size={9}/>}
      {label ?? (pass ? 'PASS' : 'FAIL')}
    </span>
  )
}

export function RatingBadge({ rating }: { rating: string }) {
  const map: Record<string,string> = {
    excellent:'bg-success/10 text-success border-success/25', good:'bg-teal/10 text-teal border-teal/25',
    marginal:'bg-warn/10 text-warn border-warn/25', unacceptable:'bg-danger/10 text-danger border-danger/25',
  }
  return (
    <span className={clsx('inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border', map[rating.toLowerCase()] ?? 'bg-white/5 text-muted border-white/10')}>
      {rating.toUpperCase()}
    </span>
  )
}

export function Spinner({ size = 20 }: { size?: number }) {
  return <div className="rounded-full border-2 border-teal/20 border-t-teal animate-spin" style={{ width: size, height: size }} />
}
