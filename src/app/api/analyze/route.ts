import { NextRequest, NextResponse } from 'next/server'
import { analyzeHealthReport } from '@/lib/healthEngine'

async function extractText(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text ?? ''
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('pdf') as File | null

    if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const text = await extractText(buffer)

    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        error: 'Could not read this PDF. Please use a digital (text-based) PDF — not a scanned image. Try opening the PDF and copying text to confirm it is readable.'
      }, { status: 422 })
    }

    const result = analyzeHealthReport(text)
    return NextResponse.json({ success: true, data: result })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to process: ${message}` }, { status: 500 })
  }
}
