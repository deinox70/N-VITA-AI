'use client'
import { useState, useCallback, useRef } from 'react'
import type { HealthSummary } from '@/lib/healthEngine'
import ResultsDashboard from '@/components/ResultsDashboard'

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.webp,.bmp,.tiff'
const ACCEPTED_MIME = ['application/pdf','image/jpeg','image/jpg','image/png','image/webp','image/bmp','image/tiff']

function getFileIcon(file: File) {
  if (file.type === 'application/pdf') return '📄'
  if (file.type.startsWith('image/')) return '🖼️'
  return '📁'
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Analysing your report…')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<HealthSummary | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!ACCEPTED_MIME.includes(f.type)) {
      setError('Unsupported file. Please upload a PDF or image (JPG, PNG, WEBP).')
      return
    }
    setFile(f); setError(null)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }, [])

  const analyze = async () => {
    if (!file) return
    setLoading(true); setError(null)
    if (file.type.startsWith('image/')) {
      setLoadingMsg('Running OCR on image… this may take 20-40 seconds')
    } else {
      setLoadingMsg('Reading PDF and analysing health data…')
    }
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Analysis failed')
      setResult(json.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setFile(null); setResult(null); setError(null) }

  if (result) return <ResultsDashboard data={result} onReset={reset} />

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#1c2b1e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
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
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#3ddc84] rounded-full" style={{ animation: 'pulse 2s infinite' }}></span>
          <span className="text-xs text-[#3ddc84] font-semibold uppercase tracking-wider">System Online</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-14">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10 fade-up">
            <div className="inline-flex items-center gap-2 bg-[#3ddc84]/10 border border-[#3ddc84]/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs text-[#3ddc84] font-bold tracking-widest uppercase">PDF · Images · Scanned Reports</span>
            </div>
            <h1 className="text-5xl leading-[1.1] text-[#e4f0e6] mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Know your health.<br/>
              <em className="text-[#3ddc84]">Before it warns you.</em>
            </h1>
            <p className="text-[#6b8f6e] text-base leading-relaxed max-w-sm mx-auto">
              Upload any health report — PDF, scanned image, or photo of your lab test — and get instant AI disease risk analysis.
            </p>
          </div>

          <div className="bg-[#0f1711] border border-[#1c2b1e] rounded-2xl p-7 shadow-2xl fade-up d1">
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { icon: '📄', label: 'PDF' },
                { icon: '🖼️', label: 'JPG / PNG' },
                { icon: '📸', label: 'Scanned' },
                { icon: '📋', label: 'Lab Report' },
              ].map(i => (
                <div key={i.label} className="flex items-center gap-1.5 bg-[#141f16] border border-[#1c2b1e] rounded-lg px-3 py-1.5">
                  <span className="text-sm">{i.icon}</span>
                  <span className="text-[#6b8f6e] text-xs font-semibold">{i.label}</span>
                </div>
              ))}
            </div>

            <div
              className={`drop-zone p-10 text-center mb-5 ${dragging ? 'over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

              {file ? (
                <div className="fade-in">
                  <div className="text-5xl mb-3">{getFileIcon(file)}</div>
                  <p className="text-[#3ddc84] font-bold text-base mb-1">{file.name}</p>
                  <p className="text-[#6b8f6e] text-sm">{(file.size / 1024).toFixed(1)} KB · Ready to analyse</p>
                  <button onClick={e => { e.stopPropagation(); setFile(null) }}
                    className="mt-3 text-xs text-[#6b8f6e] hover:text-[#e17055] underline">
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-3">📂</div>
                  <p className="text-[#e4f0e6] font-semibold mb-1">Drop your health report here</p>
                  <p className="text-[#6b8f6e] text-sm mb-3">Supports PDF, JPG, PNG, WEBP — digital or scanned</p>
                  <span className="text-xs text-[#3ddc84] font-semibold border border-[#3ddc84]/30 px-3 py-1 rounded-full bg-[#3ddc84]/5">
                    or click to browse
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 bg-[#e17055]/10 border border-[#e17055]/30 rounded-xl p-4 text-[#e17055] text-sm flex gap-3">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <button
              onClick={analyze}
              disabled={!file || loading}
              className="w-full py-4 rounded-xl font-bold text-[#080d0b] text-base tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3ddc84, #00b894)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-[#080d0b]/30 border-t-[#080d0b] rounded-full"
                    style={{ animation: 'spin 0.8s linear infinite' }}></span>
                  {loadingMsg}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">🧬 Analyse Health Report</span>
              )}
            </button>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {[
                { icon: '🩸', label: 'Blood Panel' },
                { icon: '❤️', label: 'Heart Risk' },
                { icon: '🫘', label: 'Kidney' },
                { icon: '🦋', label: 'Thyroid' },
              ].map(i => (
                <div key={i.label} className="bg-[#141f16] border border-[#1c2b1e] rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{i.icon}</div>
                  <div className="text-[#6b8f6e] text-[10px] font-semibold uppercase tracking-wide">{i.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6 space-y-2">
            <p className="text-[#6b8f6e] text-xs">
              🔒 Your file never leaves your device · For informational purposes only · Always consult a doctor
            </p>
            <div className="text-xl font-bold uppercase tracking-[0.3em] text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #3ddc84, #00b894)' }}>
              ✦ Made by Paras ✦
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}