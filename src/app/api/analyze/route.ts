import { NextRequest, NextResponse } from 'next/server'
import { analyzeHealthReport } from '@/lib/healthEngine'

// ✅ Extract text from PDF
async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text ?? ''
  } catch {
    return ''
  }
}

// ✅ OCR (works for images + scanned PDF)
async function runOCR(buffer: Buffer): Promise<string> {
  try {
    const Tesseract = await import('tesseract.js')
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {}
    })
    return data.text ?? ''
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    let text = ''

    // ✅ Step 1: Try normal PDF text
    if (file.type === 'application/pdf') {
      text = await extractFromPDF(buffer)
    }

    // ✅ Step 2: If no text → OCR fallback
    if (!text || text.trim().length < 20) {
      text = await runOCR(buffer)
    }

    // ❌ Still no text
    if (!text || text.trim().length < 20) {
      return NextResponse.json({
        error: '❌ Cannot read this file. Try clearer image or proper PDF.'
      }, { status: 422 })
    }

    // ✅ Analyze
    const result = analyzeHealthReport(text)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed: ${message}` },
      { status: 500 }
    )
  }
}