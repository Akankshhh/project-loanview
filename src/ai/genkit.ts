import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is the "Emergency Hardcode" fix, as instructed.
// It forces the Genkit server to start by providing a dummy key,
// bypassing the need for a real GOOGLE_API_KEY in the environment.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSy_Emergency_Dummy_Key_For_Demo_Only", 
    }),
  ],
  logLevel: "warn", // Keep logs clean to focus on critical errors.
});
