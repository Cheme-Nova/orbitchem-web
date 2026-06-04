import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/nav'

export const metadata: Metadata = {
  title: { default: 'OrbitChem™ — Space Material Intelligence', template: '%s · OrbitChem™' },
  description: 'AI-powered aerospace material qualification. ASTM E595 outgassing, radiation stability, thermal cycling — NASA MSFC & ESA ECSS standards. Free platform by ChemeNova.',
  keywords: ['space materials', 'ASTM E595', 'outgassing calculator', 'radiation stability', 'thermal cycling', 'ChemeNova', 'OrbitChem', 'spacecraft qualification'],
  openGraph: {
    title: 'OrbitChem™ — Space Material Intelligence',
    description: 'AI-powered aerospace material qualification platform by ChemeNova.',
    url: 'https://chemenova.com/orbitchem',
    siteName: 'ChemeNova',
    images: [{ url: 'https://chemenova.com/assets/orbitchem-og-image.jpg' }],
  },
  twitter: { card: 'summary_large_image', title: 'OrbitChem™', description: 'Space material qualification in one platform.' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy">
        <Nav />
        <main className="pt-16 min-h-[calc(100vh-112px)]">
          {children}
        </main>
        <footer className="border-t border-white/6 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted text-[11px] font-mono">
          <span>OrbitChem™ v2.0 · ChemeNova LLC · <a href="https://chemenova.com/orbitchem" className="hover:text-teal transition-colors">chemenova.com/orbitchem</a></span>
          <div className="flex gap-5">
            <a href="https://github.com/Cheme-Nova/OrbitChem" target="_blank" className="hover:text-teal transition-colors">GitHub</a>
            <a href="https://huggingface.co/spaces/chemenovausa/OrbitChem" target="_blank" className="hover:text-teal transition-colors">HF Spaces (Streamlit)</a>
            <a href="https://chemenova.com/orbitchem/demo" className="hover:text-teal transition-colors">Static Demo</a>
            <a href="mailto:shehan@chemenova.com" className="hover:text-teal transition-colors">Contact</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
