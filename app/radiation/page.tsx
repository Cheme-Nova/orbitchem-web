'use client'
import Link from 'next/link'
export default function RadiationPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="section-label">// Radiation Stability</div>
      <h1 className="section-title">Radiation <em className="text-teal not-italic">Stability</em></h1>
      <p className="text-muted text-sm mt-3 max-w-lg leading-relaxed">
        Standalone G-value / Harrington radiation screening — coming next sprint.
        Use the <Link href="/qualification" className="text-teal underline">Full Qualification Suite</Link> for complete analysis now.
      </p>
    </div>
  )
}
