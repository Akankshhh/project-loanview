
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { generate } from '@genkit-ai/ai';

const BankingAdvisorInputSchema = z.object({
  query: z.string().describe("The user's question about banking or loans."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).optional(),
});
export type BankingAdvisorInput = z.infer<typeof BankingAdvisorInputSchema>;

const BankingAdvisorOutputSchema = z.object({
  text: z.string(),
  flow: z.enum(['none', 'eligibilityCheck']).optional().default('none'),
});
export type BankingAdvisorOutput = z.infer<typeof BankingAdvisorOutputSchema>;


export async function bankingAdvisorFlow(input: BankingAdvisorInput): Promise<BankingAdvisorOutput> {
  return bankingAdvisorGenkitFlow(input);
}

// Simple rule-based intent detection
const detectIntent = (query: string): 'eligibility' | 'process' | 'general' => {
  const lowerQuery = query.toLowerCase();
  if (/\b(eligible|eligibility|can i get|check)\b/i.test(lowerQuery)) {
    return 'eligibility';
  }
  if (/\b(process|steps|how to get|explain)\b/i.test(lowerQuery) && /\b(loan)\b/i.test(lowerQuery)) {
    return 'process';
  }
  return 'general';
};

const detectLoanType = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('home')) return 'Home Loan';
    if (lowerQuery.includes('personal')) return 'Personal Loan';
    if (lowerQuery.includes('education')) return 'Education Loan';
    if (lowerQuery.includes('vehicle')) return 'Vehicle Loan';
    if (lowerQuery.includes('business')) return 'Business Loan';
    if (lowerQuery.includes('gold')) return 'Gold Loan';
    return 'a loan';
}

const bankingAdvisorGenkitFlow = ai.defineFlow(
  {
    name: 'bankingAdvisorGenkitFlow',
    inputSchema: BankingAdvisorInputSchema,
    outputSchema: BankingAdvisorOutputSchema,
  },
  async ({ query }) => {
    const intent = detectIntent(query);
    const loanType = detectLoanType(query);

    // Scenario 1: User is asking about eligibility
    if (intent === 'eligibility') {
      return {
        text: `Of course, I can help you check your eligibility for ${loanType}. Let's start with a few questions. What is your CIBIL score?`,
        flow: 'eligibilityCheck',
      };
    }

    // Scenario 2: User is asking for a process
    if (intent === 'process') {
      const { text } = await generate({
        model: 'gemini-1.5-flash-latest',
        prompt: `You are a helpful banking assistant. The user wants to know the application process for a specific type of loan.
        Based on the user's query about a "${loanType}", provide a clear, step-by-step guide for that loan application process.
        Your answer should be concise, in simple language, and formatted as a numbered list.
        Do not ask any follow-up questions. Just provide the process steps.`,
        history: [{ role: 'user', content: [{ text: query }] }]
      });
      return { text, flow: 'none' };
    }

    // Scenario 3: General question
    // We provide a safe, generic response for anything else to avoid errors.
    return {
      text: "Thank you for your query. For detailed information on topics other than loan processes or eligibility, I recommend visiting one of our branches or contacting customer support. Would you like to check your loan eligibility or understand a loan process?",
      flow: 'none',
    };
  }
);
