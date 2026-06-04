'use client'
import Link from 'next/link'
export default function OutgassingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="section-label">// Outgassing Screen</div>
      <h1 className="section-title">ASTM E595 <em className="text-teal not-italic">Outgassing</em></h1>
      <p className="text-muted text-sm mt-3 max-w-lg leading-relaxed">
        Standalone ASTM E595 TML / CVCM screening — coming next sprint.
        Use the <Link href="/qualification" className="text-teal underline">Full Qualification Suite</Link> for complete analysis now.
      </p>
    </div>
  )
}
