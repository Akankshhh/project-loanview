
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- SCHEMAS ---
export const BankingAdvisorInputSchema = z.object({
  query: z.string(),
});
export type BankingAdvisorInput = z.infer<typeof BankingAdvisorInputSchema>;

export const BankingAdvisorOutputSchema = z.object({
  text: z.string(),
  flow: z.enum(['eligibilityCheck', 'processInfo', 'none']),
});
export type BankingAdvisorOutput = z.infer<typeof BankingAdvisorOutputSchema>;

// --- KNOWLEDGE BASE ---
const LOAN_PROCESS_KNOWLEDGE: Record<string, string> = {
  home: "The Home Loan process is: 1. Submit Application with income & property docs. 2. Bank conducts legal & technical verification of the property. 3. Loan is sanctioned. 4. Sign loan agreement. 5. Disbursement.",
  personal: "For a Personal Loan: 1. Apply with KYC & income proof. 2. Bank assesses your credit score & eligibility. 3. Loan sanction & agreement. 4. Funds disbursed to your account.",
  vehicle: "To get a Vehicle Loan: 1. Choose a vehicle & get the proforma invoice. 2. Apply with KYC, income proof, & invoice. 3. Bank sanctions the loan. 4. Down payment is made. 5. Disbursement to the dealer.",
  education: "The Education Loan process involves: 1. Admission confirmation from the institution. 2. Apply with admission letter, fee structure, and co-applicant's income proof. 3. Loan sanction. 4. Disbursement directly to the institution.",
  business: "For a Business Loan: 1. Prepare a business plan & project report. 2. Apply with business registration, financials for the last 3 years, and KYC. 3. Bank assesses the proposal. 4. Sanction & disbursement.",
  gold: "For a Gold Loan: 1. Take your gold ornaments to the bank. 2. Gold is valued by the bank's appraiser. 3. Apply with KYC documents. 4. Loan is sanctioned based on gold value. 5. Instant disbursement."
};

// --- GENKIT FLOW ---
export const bankingAdvisorGenkitFlow = ai.defineFlow(
  {
    name: 'bankingAdvisorGenkitFlow',
    inputSchema: BankingAdvisorInputSchema,
    outputSchema: BankingAdvisorOutputSchema,
  },
  async ({ query }) => {
    const lowerQuery = query.toLowerCase();

    // --- Intent Detection ---
    const isEligibilityQuery = /\b(eligible|eligibility|am i|can i get)\b/.test(lowerQuery);
    const isProcessQuery = /\b(process|steps|procedure|how to apply)\b/.test(lowerQuery);
    
    // Scenario 1: User is asking for eligibility
    if (isEligibilityQuery) {
      return {
        text: "Of course! I can help with a basic eligibility check. What is your approximate CIBIL score?",
        flow: 'eligibilityCheck',
      };
    }

    // Scenario 2: User is asking for a process
    if (isProcessQuery) {
      const loanTypes = Object.keys(LOAN_PROCESS_KNOWLEDGE);
      const foundLoanType = loanTypes.find(type => lowerQuery.includes(type));
      
      if (foundLoanType) {
        return {
          text: LOAN_PROCESS_KNOWLEDGE[foundLoanType],
          flow: 'processInfo',
        };
      }
      // If they ask for "loan process" in general
      return {
          text: "Which loan process are you interested in? For example, you can ask about the 'home loan process' or 'personal loan process'.",
          flow: 'processInfo',
      };
    }

    // --- 3. ATTEMPT API (With Crash Protection) ---
    try {
      console.log("   Sending to AI for a general query...");
      const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: `You are a helpful banking assistant. The user is asking a general question. 
        If the question is about loans or banking, provide a helpful answer. 
        If it is not related to banking, politely decline to answer.
        User question: "${query}"`,
      });

      return { 
        text: llmResponse.text(),
        flow: 'none'
      };

    } catch (error: any) {
      console.warn("   ⚠️ API Call Failed (Using Fallback):", error.message);
      return { 
        text: "Thank you for your query. For detailed information on topics other than loan processes or eligibility, I recommend visiting one of our branches or contacting customer support. Would you like to check your loan eligibility or understand a loan process?",
        flow: 'none' 
      };
    }
  }
);

// --- FRONTEND EXPORT ---
export async function bankingAdvisorFlow(input: BankingAdvisorInput): Promise<BankingAdvisorOutput> {
  return bankingAdvisorGenkitFlow(input);
}
