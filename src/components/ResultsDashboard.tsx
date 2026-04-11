'use client'
import { useState } from 'react'
import type { HealthSummary, HealthMarker, DiseaseRisk } from '@/lib/healthEngine'

const RISK_CLASS: Record<string, string> = {
  critical: 'risk-critical', high: 'risk-high', moderate: 'risk-moderate', low: 'risk-low',
}
const RISK_COLOR: Record<string, string> = {
  critical: '#e17055', high: '#fdcb6e', moderate: '#3ddc84', low: '#6b8f6e',
}
const STATUS_CLASS: Record<string, string> = {
  normal: 'text-[#3ddc84]', high: 'text-[#e17055]', low: 'text-[#fdcb6e]', critical: 'text-[#e17055] font-bold',
}
const CAT_ICON: Record<string, string> = {
  Lipid: '🫀', Glucose: '🩸', Cardiovascular: '❤️', CBC: '💉',
  Kidney: '🫘', Liver: '🫁', Thyroid: '🦋', Vitamins: '☀️',
  Inflammation: '🔥', Anthropometry: '⚖️', Electrolytes: '⚡',
}

function ScoreRing({ score }: { score: number }) {
  const r = 48, c = 2 * Math.PI * r, dash = (score / 100) * c
  const color = score >= 75 ? '#3ddc84' : score >= 55 ? '#fdcb6e' : '#e17055'
  return (
    <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="#1c2b1e" strokeWidth="9" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.5s ease' }} />
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-3xl" style={{ color }}>{score}</div>
        <div className="text-[#6b8f6e] text-xs">/ 100</div>
      </div>
    </div>
  )
}

function RiskCard({ risk, i }: { risk: DiseaseRisk; i: number }) {
  const [open, setOpen] = useState(false)
  const color = RISK_COLOR[risk.riskLevel]
  const delays = ['d1','d2','d3','d4','d5']
  return (
    <div className={`fade-up ${delays[Math.min(i,4)]} bg-[#0f1711] border border-[#1c2b1e] rounded-xl overflow-hidden`}>
      <div className="p-5 cursor-pointer hover:bg-[#141f16] transition-colors" onClick={() => setOpen(!open)}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{risk.icon}</span>
            <div>
              <div className="font-semibold text-[#e4f0e6] text-sm">{risk.disease}</div>
              <div className="text-[#6b8f6e] text-xs mt-0.5">{risk.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${RISK_CLASS[risk.riskLevel]}`}>
              {risk.riskLevel}
            </span>
            <span className="text-[#6b8f6e] text-xs">{open ? '▲' : '▼'}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${risk.riskScore}%`, background: color, '--w': `${risk.riskScore}%` } as React.CSSProperties} />
        </div>
        <div className="flex justify-between mt-1.5 mb-3">
          <span className="text-xs text-[#6b8f6e]">Risk Score</span>
          <span className="text-xs font-bold font-mono" style={{ color }}>{risk.riskScore}%</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {risk.triggeringMarkers.map(m => (
            <span key={m} className="text-xs bg-[#1c2b1e] text-[#6b8f6e] px-2 py-0.5 rounded font-mono">{m}</span>
          ))}
        </div>
      </div>
      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-[#1c2b1e] fade-in space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b8f6e] mb-1.5">What This Means</div>
            <p className="text-[#e4f0e6] text-sm leading-relaxed">{risk.explanation}</p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b8f6e] mb-1.5">What To Do</div>
            <p className="text-[#3ddc84] text-sm leading-relaxed">{risk.recommendation}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1c2b1e] rounded-lg p-3">
              <div className="text-[#6b8f6e] text-xs mb-1">Timeframe</div>
              <div className="text-[#e4f0e6] text-xs font-semibold">{risk.timeframe}</div>
            </div>
            <div className="bg-[#1c2b1e] rounded-lg p-3">
              <div className="text-[#6b8f6e] text-xs mb-1">AI Confidence</div>
              <div className="text-[#e4f0e6] text-xs font-semibold">{risk.confidence}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MarkerRow({ marker }: { marker: HealthMarker }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1c2b1e] last:border-0">
      <div className="flex items-center gap-2.5">
        <span>{CAT_ICON[marker.category] ?? '🔬'}</span>
        <div>
          <div className="text-sm text-[#e4f0e6] font-medium">{marker.name}</div>
          <div className="text-xs text-[#6b8f6e] font-mono">{marker.normalRange}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold font-mono ${STATUS_CLASS[marker.status] ?? 'text-[#3ddc84]'}`}>
          {marker.value} {marker.unit}
        </div>
        <div className={`text-xs capitalize ${STATUS_CLASS[marker.status] ?? 'text-[#3ddc84]'}`}>{marker.status}</div>
      </div>
    </div>
  )
}

export default function ResultsDashboard({ data, onReset }: { data: HealthSummary; onReset: () => void }) {
  const [tab, setTab] = useState<'risks' | 'markers' | 'lifestyle'>('risks')
  const gradeColor = data.grade === 'A' || data.grade === 'B' ? '#3ddc84' : data.grade === 'C' ? '#fdcb6e' : '#e17055'
  const catMap: Record<string, HealthMarker[]> = {}
  data.markers.forEach(m => { (catMap[m.category] ??= []).push(m) })

  return (
    <div className="relative z-10 min-h-screen">
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#1c2b1e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #3ddc84, #00b894)' }}>
            🧬
          </div>
          <div>
            <div className="text-lg font-bold text-[#e4f0e6] leading-none">
              VitaHealth <span className="text-[#3ddc84]">AI</span>
            </div>
            <div className="text-[10px] text-[#6b8f6e] uppercase tracking-widest font-semibold">Health Intelligence</div>
          </div>
        </div>
        <button onClick={onReset}
          className="text-sm text-[#6b8f6e] hover:text-[#e4f0e6] border border-[#1c2b1e] hover:border-[#3ddc84] px-4 py-2 rounded-lg transition-all">
          New Report
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {data.criticalAlerts.length > 0 && (
          <div className="mb-6 bg-[#e17055]/10 border border-[#e17055]/30 rounded-2xl p-5 fade-up">
            <div className="text-[#e17055] font-bold text-sm uppercase tracking-widest mb-3">
              🚨 Critical Alerts — See a Doctor Immediately
            </div>
            {data.criticalAlerts.map((a, i) => <div key={i} className="text-[#e4f0e6] text-sm mb-1">{a}</div>)}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
          <div className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-6 flex flex-col items-center fade-up">
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b8f6e] mb-4">Overall Health Score</div>
            <ScoreRing score={data.overallScore} />
            <div className="mt-4 text-center">
              <div className="text-4xl font-bold" style={{ color: gradeColor }}>{data.grade}</div>
              <div className="text-[#6b8f6e] text-xs mt-1">
                {data.grade === 'A' ? 'Excellent' : data.grade === 'B' ? 'Good' : data.grade === 'C' ? 'Fair' : data.grade === 'D' ? 'Poor' : 'Critical'}
              </div>
            </div>
          </div>

          <div className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-6 fade-up d1">
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b8f6e] mb-4">Patient Information</div>
            <div className="space-y-3">
              {[
                { label: 'Name',   value: data.patientInfo.name ?? 'Not found' },
                { label: 'Age',    value: data.patientInfo.age ? `${data.patientInfo.age} years` : 'Not found' },
                { label: 'Gender', value: data.patientInfo.gender ?? 'Not found' },
                { label: 'Date',   value: data.patientInfo.date ?? 'Not found' },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-[#6b8f6e]">{r.label}</span>
                  <span className="text-[#e4f0e6] font-medium capitalize">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-6 fade-up d2">
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b8f6e] mb-4">Analysis Summary</div>
            <div className="space-y-3">
              {[
                { label: 'Markers Detected', value: data.markers.length, color: '#3ddc84' },
                { label: 'Abnormal Markers', value: data.markers.filter(m => m.status !== 'normal').length, color: '#fdcb6e' },
                { label: 'Diseases Flagged', value: data.diseaseRisks.length, color: '#e17055' },
                { label: 'Critical Risks',   value: data.diseaseRisks.filter(d => d.riskLevel === 'critical').length, color: '#e17055' },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-[#6b8f6e]">{r.label}</span>
                  <span className="font-bold font-mono" style={{ color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(['risks', 'markers', 'lifestyle'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                tab === t ? 'bg-[#3ddc84]/10 border-[#3ddc84]/40 text-[#3ddc84]'
                          : 'bg-transparent border-[#1c2b1e] text-[#6b8f6e] hover:text-[#e4f0e6]'
              }`}>
              {t === 'risks' ? `🔮 Disease Risks (${data.diseaseRisks.length})`
               : t === 'markers' ? `🧪 Lab Markers (${data.markers.length})`
               : '💡 Lifestyle Advice'}
            </button>
          ))}
        </div>

        {tab === 'risks' && (
          data.diseaseRisks.length === 0
            ? <div className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <div className="text-[#3ddc84] font-bold text-lg mb-2">No significant risks detected!</div>
                <div className="text-[#6b8f6e] text-sm">Your markers appear within healthy ranges.</div>
              </div>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.diseaseRisks.map((r, i) => <RiskCard key={r.disease} risk={r} i={i} />)}
              </div>
        )}

        {tab === 'markers' && (
          data.markers.length === 0
            ? <div className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🔬</div>
                <div className="text-[#fdcb6e] font-bold text-lg mb-2">No markers detected</div>
                <div className="text-[#6b8f6e] text-sm">Please upload a digital text-based PDF.</div>
              </div>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(catMap).map(([cat, mks]) => (
                  <div key={cat} className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-5 fade-up">
                    <div className="flex items-center gap-2 mb-3">
                      <span>{CAT_ICON[cat] ?? '🔬'}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#6b8f6e]">{cat}</span>
                    </div>
                    {mks.map(m => <MarkerRow key={m.name} marker={m} />)}
                  </div>
                ))}
              </div>
        )}

        {tab === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.lifestyle.map((item, i) => {
              const delays = ['d1','d2','d3','d4','d5']
              return (
                <div key={item.area} className={`bg-[#0f1711] border rounded-2xl p-5 fade-up ${delays[Math.min(i,4)]} ${
                  item.priority === 'high' ? 'border-[#e17055]/30' : item.priority === 'medium' ? 'border-[#fdcb6e]/20' : 'border-[#1c2b1e]'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-[#e4f0e6] font-semibold text-sm">{item.area}</div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${
                        item.priority === 'high' ? 'text-[#e17055]' : item.priority === 'medium' ? 'text-[#fdcb6e]' : 'text-[#6b8f6e]'
                      }`}>{item.priority} priority</span>
                    </div>
                  </div>
                  <p className="text-[#6b8f6e] text-sm leading-relaxed">{item.message}</p>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-10 border-t border-[#1c2b1e] pt-6 text-center space-y-2">
          <p className="text-[#6b8f6e] text-xs">
            VitaHealth AI is for educational purposes only. Always consult a qualified doctor.
          </p>
          <div className="text-lg font-bold uppercase tracking-[0.3em] text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #3ddc84, #00b894)' }}>
            MADE BY PARAS
          </div>
        </div>
      </div>
    </div>
  )
}
