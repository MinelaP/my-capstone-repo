import { NextResponse } from 'next/server';
import { executeScoreLead, scoreLeadSchema } from '@/lib/tools/scoreLead';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Jednostavno parsiranje iz unesenog teksta radi testiranja
    const isErrorTest = prompt.toLowerCase().includes('fail');
    
    const mockInput = {
      companyName: isErrorTest ? 'FAIL Corp' : 'Acme Corp',
      employeeCount: 120,
      budget: isErrorTest ? -100 : 50000,
      industry: 'IT & Software',
    };

    // Validacija ulaza preko Zod sheme
    const validatedInput = scoreLeadSchema.parse(mockInput);

    // Izvršavanje alata
    const result = await executeScoreLead(validatedInput);

    return NextResponse.json({
      success: true,
      input: validatedInput,
      output: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Greška pri izvršavanju alata' },
      { status: 400 }
    );
  }
}