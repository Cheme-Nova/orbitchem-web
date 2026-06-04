# OrbitChem™ Web — Next.js Frontend

**OrbitChem™** space material intelligence platform — Next.js 14 frontend, wired to the FastAPI backend at [Cheme-Nova/OrbitChem](https://github.com/Cheme-Nova/OrbitChem).

## Stack
- **Next.js 14** App Router · TypeScript · Tailwind CSS · Recharts
- **API**: FastAPI backend at `api/main_v2.py` in the OrbitChem repo

## Pages
| Route | Module |
|-------|--------|
| `/` | Dashboard |
| `/qualification` | Full Qualification Suite (outgassing + radiation + thermal) |
| `/type2` | ⚡ Type II Integrated Qualification |
| `/orbit-comparison` | 🔭 Orbit Comparison — same blend across 6 environments |
| `/materials` | Materials Database (38 space-grade materials) |
| `/outgassing` | ASTM E595 screen |
| `/radiation` | Radiation stability |
| `/thermal` | Thermal cycling |
| `/spacechem` | SpaceChem-AI |

## Run locally
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                   # http://localhost:3001
```

Needs the FastAPI backend running:
```bash
# In OrbitChem repo
uvicorn api.main_v2:app --port 8003
# or point to HF Spaces: NEXT_PUBLIC_API_URL=https://chemenovausa-orbitchem.hf.space
```

## Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Cheme-Nova/orbitchem-web)

1. Import `Cheme-Nova/orbitchem-web` on Vercel
2. Add env var: `NEXT_PUBLIC_API_URL=https://chemenovausa-orbitchem.hf.space`
3. Deploy → add custom domain `app.chemenova.com`

## Architecture
```
orbitchem-web/          ← this repo (Next.js frontend)
  app/                  ← pages (App Router)
  components/           ← nav, blend-builder, qual-card
  lib/                  ← typed API client + TypeScript interfaces

Cheme-Nova/OrbitChem/   ← backend repo (FastAPI + Streamlit)
  api/main_v2.py        ← FastAPI endpoints
  modules/              ← outgassing, radiation, thermal, SpaceChem-AI
  app.py                ← Streamlit platform (HF Spaces)
```

© 2026 ChemeNova LLC · [chemenova.com/orbitchem](https://chemenova.com/orbitchem)
