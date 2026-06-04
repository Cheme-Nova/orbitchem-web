'use client'
import Link from 'next/link'
export default function ThermalPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="section-label">// Thermal Cycling</div>
      <h1 className="section-title">Thermal <em className="text-teal not-italic">Cycling</em></h1>
      <p className="text-muted text-sm mt-3 max-w-lg leading-relaxed">
        Standalone Coffin-Manson thermal cycling predictor — coming next sprint.
        Use the <Link href="/qualification" className="text-teal underline">Full Qualification Suite</Link> for complete analysis now.
      </p>
    </div>
  )
}
