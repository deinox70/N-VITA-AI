export interface HealthMarker {
  name: string
  value: number
  unit: string
  status: 'normal' | 'high' | 'low' | 'critical'
  normalRange: string
  category: string
}

export interface DiseaseRisk {
  disease: string
  category: string
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  riskScore: number
  confidence: number
  triggeringMarkers: string[]
  explanation: string
  recommendation: string
  timeframe: string
  icon: string
}

export interface LifestyleInsight {
  area: string
  icon: string
  message: string
  priority: 'high' | 'medium' | 'low'
}

export interface PatientInfo {
  name?: string
  age?: number
  gender?: string
  date?: string
}

export interface HealthSummary {
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  markers: HealthMarker[]
  diseaseRisks: DiseaseRisk[]
  keyFindings: string[]
  positives: string[]
  criticalAlerts: string[]
  lifestyle: LifestyleInsight[]
  patientInfo: PatientInfo
}

// ── Marker patterns ────────────────────────────────────────────────────────────
const PATTERNS: { key: string; patterns: RegExp[]; unit: string; category: string }[] = [
  { key: 'Total Cholesterol',   patterns: [/total\s*cholesterol[\s:=]+([0-9.]+)/i, /cholesterol[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Lipid' },
  { key: 'LDL',                 patterns: [/ldl[\s\-cholesterol:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Lipid' },
  { key: 'HDL',                 patterns: [/hdl[\s\-cholesterol:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Lipid' },
  { key: 'Triglycerides',       patterns: [/triglycerides?[\s:=]+([0-9.]+)/i, /\btg[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Lipid' },
  { key: 'Fasting Blood Sugar', patterns: [/fasting\s*(blood\s*sugar|glucose|bs)[\s:=]+([0-9.]+)/i, /\bfbs[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Glucose' },
  { key: 'HbA1c',               patterns: [/hba1c[\s:=]+([0-9.]+)/i, /\ba1c[\s:=]+([0-9.]+)/i], unit: '%', category: 'Glucose' },
  { key: 'Random Blood Sugar',  patterns: [/random\s*(blood\s*sugar|glucose)[\s:=]+([0-9.]+)/i, /\brbs[\s:=]+([0-9.]+)/i, /ppbs[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Glucose' },
  { key: 'Systolic BP',         patterns: [/systolic[\s:=]+([0-9]+)/i, /bp[\s:=]+([0-9]+)\/[0-9]+/i, /blood\s*pressure[\s:=]+([0-9]+)\//i], unit: 'mmHg', category: 'Cardiovascular' },
  { key: 'Diastolic BP',        patterns: [/diastolic[\s:=]+([0-9]+)/i, /bp[\s:=]+[0-9]+\/([0-9]+)/i, /blood\s*pressure[\s:=]+[0-9]+\/([0-9]+)/i], unit: 'mmHg', category: 'Cardiovascular' },
  { key: 'Hemoglobin',          patterns: [/hemoglobin[\s:=]+([0-9.]+)/i, /\bhb[\s:=]+([0-9.]+)/i, /\bhgb[\s:=]+([0-9.]+)/i], unit: 'g/dL', category: 'CBC' },
  { key: 'WBC',                 patterns: [/wbc[\s:=]+([0-9.]+)/i, /white\s*blood\s*cell[\s:=]+([0-9.]+)/i], unit: 'x10³/µL', category: 'CBC' },
  { key: 'Platelets',           patterns: [/platelets?[\s:=]+([0-9.]+)/i, /\bplt[\s:=]+([0-9.]+)/i], unit: 'x10³/µL', category: 'CBC' },
  { key: 'RBC',                 patterns: [/\brbc[\s:=]+([0-9.]+)/i], unit: 'x10⁶/µL', category: 'CBC' },
  { key: 'Creatinine',          patterns: [/creatinine[\s:=]+([0-9.]+)/i, /serum\s*creatinine[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Kidney' },
  { key: 'Urea / BUN',          patterns: [/\burea[\s:=]+([0-9.]+)/i, /\bbun[\s:=]+([0-9.]+)/i, /blood\s*urea[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Kidney' },
  { key: 'eGFR',                patterns: [/egfr[\s:=]+([0-9.]+)/i, /\bgfr[\s:=]+([0-9.]+)/i], unit: 'mL/min', category: 'Kidney' },
  { key: 'Uric Acid',           patterns: [/uric\s*acid[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Kidney' },
  { key: 'ALT (SGPT)',          patterns: [/\balt[\s:=]+([0-9.]+)/i, /sgpt[\s:=]+([0-9.]+)/i], unit: 'U/L', category: 'Liver' },
  { key: 'AST (SGOT)',          patterns: [/\bast[\s:=]+([0-9.]+)/i, /sgot[\s:=]+([0-9.]+)/i], unit: 'U/L', category: 'Liver' },
  { key: 'Total Bilirubin',     patterns: [/total\s*bilirubin[\s:=]+([0-9.]+)/i], unit: 'mg/dL', category: 'Liver' },
  { key: 'Albumin',             patterns: [/albumin[\s:=]+([0-9.]+)/i], unit: 'g/dL', category: 'Liver' },
  { key: 'TSH',                 patterns: [/\btsh[\s:=]+([0-9.]+)/i], unit: 'mIU/L', category: 'Thyroid' },
  { key: 'T3',                  patterns: [/\bt3\b[\s:=]+([0-9.]+)/i], unit: 'ng/dL', category: 'Thyroid' },
  { key: 'T4',                  patterns: [/\bt4\b[\s:=]+([0-9.]+)/i], unit: 'µg/dL', category: 'Thyroid' },
  { key: 'Vitamin D',           patterns: [/vitamin\s*d[\s:=]+([0-9.]+)/i, /25-?oh[\s:=]+([0-9.]+)/i], unit: 'ng/mL', category: 'Vitamins' },
  { key: 'Vitamin B12',         patterns: [/vitamin\s*b12[\s:=]+([0-9.]+)/i, /\bb12[\s:=]+([0-9.]+)/i], unit: 'pg/mL', category: 'Vitamins' },
  { key: 'Ferritin',            patterns: [/ferritin[\s:=]+([0-9.]+)/i], unit: 'ng/mL', category: 'Vitamins' },
  { key: 'Iron',                patterns: [/serum\s*iron[\s:=]+([0-9.]+)/i, /\biron[\s:=]+([0-9.]+)/i], unit: 'µg/dL', category: 'Vitamins' },
  { key: 'CRP',                 patterns: [/\bcrp[\s:=]+([0-9.]+)/i, /c-reactive\s*protein[\s:=]+([0-9.]+)/i], unit: 'mg/L', category: 'Inflammation' },
  { key: 'ESR',                 patterns: [/\besr[\s:=]+([0-9.]+)/i], unit: 'mm/hr', category: 'Inflammation' },
  { key: 'BMI',                 patterns: [/\bbmi[\s:=]+([0-9.]+)/i, /body\s*mass\s*index[\s:=]+([0-9.]+)/i], unit: 'kg/m2', category: 'Anthropometry' },
  { key: 'Sodium',              patterns: [/sodium[\s:=]+([0-9.]+)/i], unit: 'mEq/L', category: 'Electrolytes' },
  { key: 'Potassium',           patterns: [/potassium[\s:=]+([0-9.]+)/i], unit: 'mEq/L', category: 'Electrolytes' },
]

interface Ref { low?: number; high?: number; critLow?: number; critHigh?: number; range: string }

const REFS: Record<string, Ref> = {
  'Total Cholesterol':   { high: 200, critHigh: 240, range: '< 200 mg/dL' },
  'LDL':                 { high: 100, critHigh: 160, range: '< 100 mg/dL' },
  'HDL':                 { low: 60, critLow: 40, range: '> 60 mg/dL' },
  'Triglycerides':       { high: 150, critHigh: 200, range: '< 150 mg/dL' },
  'Fasting Blood Sugar': { low: 70, high: 100, critHigh: 126, range: '70-99 mg/dL' },
  'HbA1c':               { high: 5.7, critHigh: 6.5, range: '< 5.7%' },
  'Random Blood Sugar':  { high: 140, critHigh: 200, range: '< 140 mg/dL' },
  'Systolic BP':         { low: 90, high: 120, critHigh: 140, range: '< 120 mmHg' },
  'Diastolic BP':        { low: 60, high: 80, critHigh: 90, range: '< 80 mmHg' },
  'Hemoglobin':          { low: 12, critLow: 10, high: 17.5, range: 'M:13.5-17.5 F:12-15.5 g/dL' },
  'WBC':                 { low: 4, high: 11, critHigh: 15, range: '4-11 x10³/µL' },
  'Platelets':           { low: 150, critLow: 100, high: 400, critHigh: 500, range: '150-400 x10³/µL' },
  'Creatinine':          { low: 0.5, high: 1.2, critHigh: 2.0, range: '0.6-1.2 mg/dL' },
  'Urea / BUN':          { high: 20, critHigh: 40, range: '7-20 mg/dL' },
  'eGFR':                { low: 60, critLow: 30, range: '> 60 mL/min' },
  'Uric Acid':           { high: 7, critHigh: 9, range: '3.5-7.0 mg/dL' },
  'ALT (SGPT)':          { high: 40, critHigh: 80, range: '7-40 U/L' },
  'AST (SGOT)':          { high: 40, critHigh: 80, range: '10-40 U/L' },
  'Total Bilirubin':     { high: 1.2, critHigh: 2.0, range: '0.2-1.2 mg/dL' },
  'Albumin':             { low: 3.5, critLow: 2.5, high: 5.0, range: '3.5-5.0 g/dL' },
  'TSH':                 { low: 0.5, critLow: 0.1, high: 4.5, critHigh: 10, range: '0.5-4.5 mIU/L' },
  'Vitamin D':           { low: 30, critLow: 20, range: '30-100 ng/mL' },
  'Vitamin B12':         { low: 200, critLow: 150, range: '200-900 pg/mL' },
  'Ferritin':            { low: 12, critLow: 7, range: '12-300 ng/mL' },
  'CRP':                 { high: 1, critHigh: 10, range: '< 1 mg/L' },
  'BMI':                 { low: 18.5, high: 25, critHigh: 30, range: '18.5-24.9 kg/m2' },
  'Sodium':              { low: 136, critLow: 125, high: 145, critHigh: 155, range: '136-145 mEq/L' },
  'Potassium':           { low: 3.5, critLow: 3.0, high: 5.0, critHigh: 6.0, range: '3.5-5.0 mEq/L' },
}

const HIGHER_BETTER = new Set(['HDL', 'eGFR', 'Vitamin D', 'Vitamin B12', 'Ferritin', 'Albumin', 'Iron'])

function classify(name: string, v: number): HealthMarker['status'] {
  const r = REFS[name]; if (!r) return 'normal'
  if (HIGHER_BETTER.has(name)) {
    if (r.critLow !== undefined && v < r.critLow) return 'critical'
    if (r.low !== undefined && v < r.low) return 'low'
    return 'normal'
  }
  if (r.critHigh !== undefined && v > r.critHigh) return 'critical'
  if (r.high !== undefined && v > r.high) return 'high'
  if (r.critLow !== undefined && v < r.critLow) return 'critical'
  if (r.low !== undefined && v < r.low) return 'low'
  return 'normal'
}

function risk(
  disease: string, category: string, score: number, confidence: number,
  triggers: string[], explanation: string, recommendation: string,
  timeframe: string, icon: string
): DiseaseRisk {
  const s = Math.min(score, 95)
  const level: DiseaseRisk['riskLevel'] = s >= 70 ? 'critical' : s >= 50 ? 'high' : s >= 25 ? 'moderate' : 'low'
  return { disease, category, riskLevel: level, riskScore: s, confidence, triggeringMarkers: triggers, explanation, recommendation, timeframe, icon }
}

function predict(markers: HealthMarker[], text: string): DiseaseRisk[] {
  const risks: DiseaseRisk[] = []
  const g = (n: string) => { const m = markers.find(m => m.name === n); return m ? m.value : null }
  const tl = text.toLowerCase()

  const fbs = g('Fasting Blood Sugar'), a1c = g('HbA1c'), rbs = g('Random Blood Sugar'), tg = g('Triglycerides')
  const ldl = g('LDL'), hdl = g('HDL'), tc = g('Total Cholesterol'), sys = g('Systolic BP'), dia = g('Diastolic BP')
  const crp = g('CRP'), cr = g('Creatinine'), egfr = g('eGFR'), bun = g('Urea / BUN'), ua = g('Uric Acid')
  const alt = g('ALT (SGPT)'), ast = g('AST (SGOT)'), bili = g('Total Bilirubin')
  const tsh = g('TSH'), hb = g('Hemoglobin'), ferr = g('Ferritin'), b12 = g('Vitamin B12')
  const vd = g('Vitamin D'), bmi = g('BMI'), esr = g('ESR'), wbc = g('WBC')

  // Diabetes
  let ds = 0; const dt: string[] = []
  if (fbs && fbs > 100) { ds += fbs > 126 ? 45 : 22; dt.push(`FBS: ${fbs}`) }
  if (a1c && a1c > 5.7) { ds += a1c > 6.5 ? 50 : 25; dt.push(`HbA1c: ${a1c}%`) }
  if (rbs && rbs > 140) { ds += rbs > 200 ? 35 : 15; dt.push(`RBS: ${rbs}`) }
  if (tg && tg > 150) { ds += 10; dt.push(`High TG`) }
  if (tl.includes('polyuria') || tl.includes('fatigue')) { ds += 8; dt.push('Symptoms') }
  if (ds > 0) risks.push(risk('Type 2 Diabetes', 'Endocrine', ds, 82, dt,
    'Elevated blood glucose markers indicate insulin resistance or impaired glucose tolerance. Left unmanaged, this progresses to full diabetes causing nerve, kidney, and eye damage.',
    'See an endocrinologist. Reduce refined carbs and sugar. Exercise 30 min daily. Monitor HbA1c every 3 months.',
    ds > 55 ? 'Needs immediate attention' : 'Within 2-5 years if untreated', '🩸'))

  // Cardiovascular
  let cs = 0; const ct: string[] = []
  if (ldl && ldl > 100) { cs += ldl > 160 ? 35 : 18; ct.push(`LDL: ${ldl}`) }
  if (hdl && hdl < 60)  { cs += hdl < 40 ? 30 : 12; ct.push(`Low HDL: ${hdl}`) }
  if (tc && tc > 200)   { cs += tc > 240 ? 25 : 10; ct.push(`Cholesterol: ${tc}`) }
  if (tg && tg > 150)   { cs += 12; ct.push(`TG: ${tg}`) }
  if (sys && sys > 120) { cs += sys > 140 ? 30 : 15; ct.push(`SBP: ${sys}`) }
  if (dia && dia > 80)  { cs += dia > 90 ? 20 : 10; ct.push(`DBP: ${dia}`) }
  if (crp && crp > 1)   { cs += 12; ct.push(`CRP: ${crp}`) }
  if (cs > 0) risks.push(risk('Cardiovascular Disease', 'Cardiology', Math.min(cs, 95), 84, ct,
    'Multiple cardiovascular risk factors detected. High LDL, low HDL, and elevated blood pressure together accelerate artery-hardening (atherosclerosis), raising heart attack and stroke risk.',
    'Cardiologist referral. Target LDL < 70, BP < 120/80. Mediterranean diet. Consider statin therapy.',
    cs > 60 ? 'High 10-year risk' : 'Long-term risk if unmanaged', '❤️'))

  // Hypertension
  if (sys && sys > 120) risks.push(risk('Hypertension', 'Cardiology',
    sys > 160 ? 80 : sys > 140 ? 60 : 35, 90, [`SBP: ${sys} mmHg`],
    'High blood pressure silently damages arteries, heart, kidneys, and eyes over time.',
    'Reduce salt intake. Exercise regularly. Avoid alcohol. If > 140 persistently, discuss medication with doctor.',
    'Chronic — needs ongoing management', '🫀'))

  // Kidney
  let ks = 0; const kt: string[] = []
  if (cr && cr > 1.2)    { ks += cr > 2.0 ? 50 : 25; kt.push(`Creatinine: ${cr}`) }
  if (egfr && egfr < 60) { ks += egfr < 30 ? 60 : 30; kt.push(`eGFR: ${egfr}`) }
  if (bun && bun > 20)   { ks += 15; kt.push(`BUN: ${bun}`) }
  if (ua && ua > 7)      { ks += 10; kt.push(`Uric Acid: ${ua}`) }
  if (ks > 0) risks.push(risk('Chronic Kidney Disease', 'Nephrology', Math.min(ks, 90), 86, kt,
    'Kidney markers suggest reduced filtration capacity. Untreated CKD progresses through stages and may require dialysis.',
    'See a nephrologist. Stay hydrated. Avoid NSAIDs. Reduce protein intake. Monitor every 3-6 months.',
    ks > 55 ? 'Urgent assessment needed' : 'Gradual progression risk', '🫘'))

  // Liver
  let ls = 0; const lt: string[] = []
  if (alt && alt > 40)    { ls += alt > 80 ? 40 : 20; lt.push(`ALT: ${alt}`) }
  if (ast && ast > 40)    { ls += ast > 80 ? 35 : 18; lt.push(`AST: ${ast}`) }
  if (bili && bili > 1.2) { ls += 15; lt.push(`Bilirubin: ${bili}`) }
  if (tg && tg > 200)     { ls += 15; lt.push('High TG') }
  if (ls > 0) risks.push(risk('Non-Alcoholic Fatty Liver Disease', 'Hepatology', Math.min(ls, 85), 76, lt,
    'Raised liver enzymes indicate hepatocellular stress — often caused by fat accumulation in liver cells.',
    'See a gastroenterologist. Avoid alcohol and hepatotoxic drugs. Gradual weight loss. Liver ultrasound recommended.',
    'Reversible with early lifestyle changes', '🫁'))

  // Thyroid
  if (tsh && tsh > 4.5) risks.push(risk('Hypothyroidism', 'Endocrine',
    tsh > 10 ? 75 : tsh > 7 ? 55 : 35, 88, [`TSH: ${tsh} mIU/L`],
    'Elevated TSH indicates an underactive thyroid — your pituitary is working harder to stimulate it. Causes fatigue, weight gain, and cold intolerance.',
    'Endocrinology referral. Free T3/T4 testing. Levothyroxine therapy may be prescribed. Retest in 6-8 weeks.',
    'Manageable with medication', '🦋'))
  if (tsh && tsh < 0.5) risks.push(risk('Hyperthyroidism', 'Endocrine',
    tsh < 0.1 ? 72 : 42, 82, [`TSH: ${tsh} mIU/L`],
    'Suppressed TSH suggests an overactive thyroid. Excess hormones speed up metabolism causing anxiety, weight loss, and heart palpitations.',
    'Urgent endocrinology evaluation. Check free T3/T4. Thyroid scan recommended.',
    'Needs prompt diagnosis', '🦋'))

  // Anemia
  let as2 = 0; const at2: string[] = []
  if (hb && hb < 12)    { as2 += hb < 10 ? 60 : 35; at2.push(`Hb: ${hb} g/dL`) }
  if (ferr && ferr < 12){ as2 += 25; at2.push(`Ferritin: ${ferr}`) }
  if (b12 && b12 < 200) { as2 += 25; at2.push(`B12: ${b12}`) }
  if (as2 > 0) risks.push(risk('Iron-Deficiency / Nutritional Anemia', 'Hematology', Math.min(as2, 80), 86, at2,
    'Low hemoglobin or iron/B12 stores mean your blood carries less oxygen, causing fatigue, dizziness, and weakness.',
    'Iron or B12 supplementation. Eat leafy greens, lentils, eggs, red meat. Recheck CBC in 8-12 weeks.',
    'Reversible with supplementation', '💉'))

  // Gout
  if (ua && ua > 7) risks.push(risk('Gout / Hyperuricemia', 'Rheumatology',
    ua > 9 ? 70 : ua > 8 ? 50 : 30, 80, [`Uric Acid: ${ua} mg/dL`],
    'High uric acid leads to crystal deposits in joints causing sudden, severe pain attacks — especially in the big toe. Also increases kidney stone risk.',
    'Reduce purines (red meat, shellfish, alcohol, beer). Stay hydrated. Allopurinol may be prescribed if persistent.',
    'Acute attacks can occur anytime', '🦴'))

  // Vitamin D
  if (vd && vd < 30) risks.push(risk('Vitamin D Deficiency', 'Nutrition',
    vd < 12 ? 70 : vd < 20 ? 50 : 30, 91, [`Vitamin D: ${vd} ng/mL`],
    'Low Vitamin D impairs calcium absorption, weakens bones and muscles, suppresses immunity, and is linked to depression and metabolic disorders.',
    'Supplement Vitamin D3 (2000-4000 IU/day). 20 min sunlight daily. Retest in 3 months.',
    'Ongoing without supplementation', '☀️'))

  // Metabolic Syndrome
  let mc = 0
  if (tg && tg > 150) mc++
  if (hdl && hdl < 40) mc++
  if (fbs && fbs > 100) mc++
  if (sys && sys > 130) mc++
  if (bmi && bmi > 30) mc++
  if (mc >= 3) risks.push(risk('Metabolic Syndrome', 'Endocrine/Cardiology',
    55 + mc * 8, 82, [`${mc}/5 criteria met`],
    'A cluster of conditions — high BP, high sugar, high triglycerides, low HDL, and obesity — that together dramatically raise the risk of heart disease, stroke, and diabetes.',
    'Mediterranean diet, 150 min/week aerobic exercise, weight reduction of 5-10%, regular monitoring of all markers.',
    'Significantly raises 10-year CVD risk', '⚠️'))

  // Inflammation
  if ((crp && crp > 5) || (esr && esr > 30) || (wbc && wbc > 11)) {
    const iScore = crp && crp > 10 ? 68 : 38
    const iT: string[] = []
    if (crp && crp > 5) iT.push(`CRP: ${crp}`)
    if (esr && esr > 30) iT.push(`ESR: ${esr}`)
    if (wbc && wbc > 11) iT.push(`WBC: ${wbc}`)
    risks.push(risk('Chronic Inflammation', 'Immunology', iScore, 74, iT,
      'Elevated inflammatory markers may signal autoimmune conditions, chronic infection, or early-stage inflammatory disease.',
      'Rule out infections and autoimmune diseases. Anti-inflammatory diet, stress management. Follow up with ANA panel.',
      'Needs further investigation', '🔥'))
  }

  return risks.sort((a, b) => b.riskScore - a.riskScore)
}

function extractPatient(text: string): PatientInfo {
  const n = text.match(/(?:patient\s*name|name)\s*[:\-]\s*([A-Za-z]+(?:\s+[A-Za-z]+)*)/i)
  const a = text.match(/(?:age)\s*[:\-]\s*(\d{1,3})/i)
  const g = text.match(/(?:sex|gender)\s*[:\-]\s*(male|female|m|f)\b/i)
  const d = text.match(/(?:date|report\s*date)\s*[:\-]\s*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i)
  return { name: n?.[1], age: a ? parseInt(a[1]) : undefined, gender: g?.[1], date: d?.[1] }
}

export function analyzeHealthReport(text: string): HealthSummary {
  const patientInfo = extractPatient(text)
  const markers: HealthMarker[] = []

  for (const mp of PATTERNS) {
    for (const pat of mp.patterns) {
      const m = text.match(pat)
      if (m) {
        const num = parseFloat(m[m.length - 1])
        if (!isNaN(num)) {
          markers.push({
            name: mp.key, value: num, unit: mp.unit,
            status: classify(mp.key, num),
            normalRange: REFS[mp.key]?.range ?? 'See lab reference',
            category: mp.category,
          })
          break
        }
      }
    }
  }

  const diseaseRisks = predict(markers, text)
  const abnormal = markers.filter(m => m.status !== 'normal').length
  const total = markers.length || 1
  const highRisk = diseaseRisks.filter(d => d.riskLevel === 'critical' || d.riskLevel === 'high').length
  const overallScore = Math.round(Math.min(98, Math.max(10, 100 - (abnormal / total) * 50 - highRisk * 8)))
  const grade = overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F'

  const keyFindings: string[] = []
  const positives: string[] = []
  const criticalAlerts: string[] = []

  for (const m of markers) {
    if (m.status === 'critical') criticalAlerts.push(`⚠️ ${m.name} critically ${m.value > (REFS[m.name]?.high ?? 999) ? 'HIGH' : 'LOW'}: ${m.value} ${m.unit}`)
    else if (m.status !== 'normal') keyFindings.push(`${m.name}: ${m.value} ${m.unit} (${m.status})`)
    else positives.push(`${m.name} is within normal range`)
  }

  const lifestyle: LifestyleInsight[] = []
  const vd2 = markers.find(m => m.name === 'Vitamin D')
  if (vd2 && vd2.value < 30) lifestyle.push({ area: 'Sunlight & Vitamin D', icon: '☀️', message: '20-30 min sunlight daily + Vitamin D3 supplement 2000 IU/day', priority: 'high' })
  const ldl2 = markers.find(m => m.name === 'LDL'), tg2 = markers.find(m => m.name === 'Triglycerides')
  if ((ldl2 && ldl2.value > 100) || (tg2 && tg2.value > 150)) lifestyle.push({ area: 'Heart-Healthy Diet', icon: '🥗', message: 'Mediterranean diet: olive oil, fish, nuts, legumes. Avoid fried food, red meat, processed snacks.', priority: 'high' })
  const fbs2 = markers.find(m => m.name === 'Fasting Blood Sugar')
  if (fbs2 && fbs2.value > 100) lifestyle.push({ area: 'Blood Sugar Control', icon: '🍬', message: 'Cut sugar and white carbs. Eat smaller meals. Walk 15 min after meals. Track carb intake.', priority: 'high' })
  lifestyle.push({ area: 'Exercise', icon: '🏃', message: '150 min/week of moderate cardio — brisk walking, cycling, swimming. Start slow and build up.', priority: 'medium' })
  lifestyle.push({ area: 'Sleep', icon: '😴', message: '7-9 hours of quality sleep. Poor sleep raises cortisol, blood sugar, and blood pressure.', priority: 'medium' })
  lifestyle.push({ area: 'Stress Management', icon: '🧘', message: 'Chronic stress raises cortisol, BP, and blood sugar. Try 10 min daily meditation or yoga.', priority: 'medium' })
  lifestyle.push({ area: 'Hydration', icon: '💧', message: 'Drink 2.5-3L of water daily. Essential for kidney health and toxin elimination.', priority: 'low' })
  lifestyle.push({ area: 'Routine Check-ups', icon: '🏥', message: 'Get a full blood panel every 6-12 months even when feeling healthy. Early detection saves lives.', priority: 'low' })

  return { overallScore, grade, markers, diseaseRisks, keyFindings, positives, criticalAlerts, lifestyle, patientInfo }
}
