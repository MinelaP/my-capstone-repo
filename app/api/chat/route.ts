import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, testMode } = await req.json();

    // 1. Sabotaža: Rate limit (429 HTTP status)
    if (testMode === 'rate-limit') {
      return NextResponse.json(
        { success: false, error: 'Too Many Requests (429): Prekoračen je dozvoljeni broj zahtjeva.' },
        { status: 429 }
      );
    }

    // 2. Sabotaža: Mid-stream / Server error (500 HTTP status)
    if (testMode === 'server-error' || prompt.toLowerCase().includes('fail')) {
      return NextResponse.json(
        { success: false, error: 'Internal Server Error (500): Stream je neočekivano prekinut.' },
        { status: 500 }
      );
    }

    // 3. Happy Path: Uspješan odgovor
    return NextResponse.json({
      success: true,
      message: `Uspješno obrađeno: "${prompt}". AI servis je generisao odgovor bez grešaka.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Nepoznata sistemska greška' },
      { status: 500 }
    );
  }
}