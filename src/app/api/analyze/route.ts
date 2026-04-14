import { NextRequest, NextResponse } from 'next/server'
import { analyzeHealthReport } from '@/lib/healthEngine'

async function extractFromPDF(buffer: Buffer): Promise<string> {
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
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB).' }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    let text = ''

    // ✅ Only PDF supported (stable on Vercel)
    if (file.type === 'application/pdf') {
      text = await extractFromPDF(buffer)
    } else {
      return NextResponse.json({
        error: 'Only PDF supported for now. Image OCR coming soon.'
      }, { status: 400 })
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({
        error: 'Could not extract text from PDF.'
      }, { status: 422 })
    }

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