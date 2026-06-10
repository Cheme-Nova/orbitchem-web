export type BlendMap = Record<string, number>
export type OrbitEnv = 'LEO' | 'GEO' | 'ISS' | 'lunar' | 'deep_space' | 'MEO'
export type Substrate = 'aluminum' | 'titanium' | 'carbon_fiber' | 'invar' | 'silicon' | 'steel'

export interface OutgassingRecord {
  ingredient: string; pct: number
  tml_contribution_pct: number; cvcm_contribution_pct: number; vcm_contribution_pct: number
  vapour_pressure_Pa: number; mw: number; risk_level: 'low'|'medium'|'high'|'critical'; note: string
}
export interface OutgassingReport {
  blend_tml_pct: number; blend_cvcm_pct: number; blend_vcm_pct: number
  nasa_pass: boolean; esa_pass: boolean
  records: OutgassingRecord[]; high_risk_ingredients: string[]
  warnings: string[]; notes: string[]
}

export interface RadiationRecord {
  ingredient: string; pct: number; polymer_class: string
  G_scission: number; G_crosslink: number; net_G: number
  dose_response: number; yellowing_index_contrib: number; rad_hardness: string
}
export interface RadiationReport {
  environment: string; mission_years: number; total_tid_krad: number
  tensile_retention_pct: number; yellowing_index: number; overall_rating: string
  records: RadiationRecord[]; recommendations: string[]; notes: string[]
}

export interface ThermalRecord {
  ingredient: string; pct: number; cte_ppm_K: number; modulus_GPa: number
  cycles_to_fail: number; delamination_GR: number; risk_level: string
}
export interface ThermalReport {
  orbit: string; mission_years: number; delta_T: number; total_cycles: number
  blend_cte_ppm_K: number; blend_min_Nf: number; blend_passes: boolean; safety_factor: number
  records: ThermalRecord[]; high_risk_ingredients: string[]
  substrate_mismatch: Record<string, { substrate_cte: number; blend_cte: number; delta_cte_ppm_K: number; risk: string }>
  recommendations: string[]; notes: string[]
}

export interface QualSummary {
  nasa_outgas_pass: boolean; esa_outgas_pass: boolean
  radiation_rating: string; thermal_pass: boolean; guardian_status?: string
}
export interface FullQualReport {
  outgassing: OutgassingReport; radiation: RadiationReport; thermal_cycling: ThermalReport
  qualification_summary: QualSummary
}

export interface BomSubstitution {
  name: string
  tml_pct: number
  cvcm_pct: number
}
export interface BomAuditRow {
  material: string
  matched_name: string | null
  in_db: boolean
  function: string
  tml_pct: number | null
  cvcm_pct: number | null
  nasa_pass: boolean
  esa_pass: boolean
  risk_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown'
  substitutions: BomSubstitution[]
}
export interface BomAuditReport {
  audit: BomAuditRow[]
  summary: { total: number; pass: number; fail: number; critical: number }
}

export interface SpaceMaterial {
  name: string; function: string
  vp_kPa: number | null; cte_ppm_K: number | null
  modulus_GPa: number | null; uts_MPa: number | null; cost_usd_kg: number | null
}

export interface ContaminationResult {
  material: string
  matched_name: string | null
  in_db: boolean
  tml_pct: number
  source_area_cm2: number
  distance_cm: number
  T_source_C: number
  T_optic_C: number
  mission_years: number
  volatile_pool_ng_cm2: number
  tau_days: number
  sticking_coeff: number
  total_deposited_ng_cm2: number
  avg_rate_ng_cm2_yr: number
  mil_std_level: string
  transmission_loss_pct: number
  risk: 'low' | 'medium' | 'high' | 'critical'
  warnings: string[]
  assumptions: string[]
  yearly_cumulative: { year: number; deposited_ng_cm2: number }[]
}
