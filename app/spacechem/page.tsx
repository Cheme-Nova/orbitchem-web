'use client'
import Link from 'next/link'
export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="section-label">// spacechem</div>
      <h1 className="section-title capitalize">spacechem <em className="text-teal not-italic">Module</em></h1>
      <p className="text-muted text-sm mt-3 max-w-lg leading-relaxed">
        Standalone spacechem screening coming in the next sprint.
        Use the <Link href="/qualification" className="text-teal underline">Full Qualification Suite</Link> for
        complete analysis, or the <Link href="/orbit-comparison" className="text-teal underline">Orbit Comparison</Link> to
        compare across environments.
      </p>
    </div>
  )
}
