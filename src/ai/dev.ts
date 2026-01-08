// src/ai/dev.ts
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from the root .env file
config({ path: path.resolve(process.cwd(), '.env') });
