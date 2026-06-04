'use client'
import Link from 'next/link'
export default function SpaceChemPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="section-label">// SpaceChem-AI</div>
      <h1 className="section-title">SpaceChem<em className="text-teal not-italic">-AI</em></h1>
      <p className="text-muted text-sm mt-3 max-w-lg leading-relaxed">
        ML-guided OPV molecular screening for Type II Civilization space solar — coming next sprint.
        Use the <Link href="/type2" className="text-teal underline">Type II Qualification</Link> for integrated molecular + spacecraft screening now.
      </p>
    </div>
  )
}
