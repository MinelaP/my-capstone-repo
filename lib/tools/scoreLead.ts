import { z } from 'zod';

// Zod shema - mala, precizna i tipizirana
export const scoreLeadSchema = z.object({
  companyName: z.string().describe('Naziv kompanije ili klijenta'),
  employeeCount: z.number().describe('Broj zaposlenih'),
  budget: z.number().describe('Godišnji budžet u USD'),
  industry: z.string().describe('Industrijski sektor'),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadSchema>;

export interface ScoreLeadOutput {
  score: number;
  tier: 'Hot' | 'Warm' | 'Cold';
  summary: string;
  keyFactors: string[];
}

// Simulacija funkcije alata (izvršava se na strani poslužitelja)
export async function executeScoreLead(input: ScoreLeadInput): Promise<ScoreLeadOutput> {
  // Simuliramo kašnjenje mreže/obrade od 1 sekunde
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Namjerni error trigger za testiranje "output-error" stanja (za recenzente)
  if (input.companyName.toLowerCase().includes('fail') || input.budget < 0) {
    throw new Error('Bodovanje nije uspjelo: Neispravni parametri ili servis nije dostupan.');
  }

  let score = 40;
  if (input.employeeCount >= 50) score += 25;
  if (input.budget >= 25000) score += 35;

  const tier = score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : 'Cold';

  return {
    score,
    tier,
    summary: `Kompanija ${input.companyName} je procijenjena kao ${tier} potencijalni klijent u sektoru ${input.industry}.`,
    keyFactors: [
      `Broj zaposlenih: ${input.employeeCount}`,
      `Kvalifikacija budžeta: $${input.budget.toLocaleString()}`,
      `Sektor: ${input.industry}`,
    ],
  };
}