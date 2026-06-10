import type { BlendMap, OutgassingReport, RadiationReport, ThermalReport, FullQualReport, SpaceMaterial, OrbitEnv, Substrate, BomAuditReport, ContaminationResult, SpaceSolarPrediction } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const msg = await r.text().catch(() => r.statusText)
    throw new Error(`${path}: ${msg}`)
  }
  return r.json()
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!r.ok) throw new Error(`${path}: ${r.statusText}`)
  return r.json()
}

export const api = {
  health: () => get<{ status: string; version: string; modules: string[] }>('/health'),

  materials: (vertical = 'space') =>
    get<{ count: number; materials: SpaceMaterial[] }>(`/api/v1/materials?vertical=${vertical}`),

  outgassing: (blend: BlendMap) =>
    post<OutgassingReport>('/api/v1/outgassing', { blend }),

  radiation: (blend: BlendMap, environment: OrbitEnv, mission_years: number) =>
    post<RadiationReport>('/api/v1/radiation', { blend, environment, mission_years }),

  thermal: (blend: BlendMap, orbit: OrbitEnv, mission_years: number, substrate: Substrate) =>
    post<ThermalReport>('/api/v1/thermal-cycling', { blend, orbit, mission_years, substrate }),

  fullQual: (blend: BlendMap, orbit: OrbitEnv, mission_years: number, substrate: Substrate) =>
    post<FullQualReport>('/api/v1/spacecraft-full', {
      blend, environment: orbit, orbit, mission_years, substrate,
    }),

  brief: (raw_prompt: string) =>
    post<{ result: Record<string, unknown> }>('/api/v1/brief', { raw_prompt }),

  bomAudit: (materials: string[]) =>
    post<BomAuditReport>('/api/v1/bom-audit', { materials }),

  spacechemPredict: (smiles: string, name: string) =>
    post<SpaceSolarPrediction>('/api/v1/spacechem-predict', { smiles, name }),

  contaminationProximity: (params: {
    material: string
    source_area_cm2: number
    distance_cm: number
    T_source_C: number
    T_optic_C: number
    mission_years: number
  }) =>
    post<ContaminationResult>('/api/v1/contamination-proximity', params),
}
