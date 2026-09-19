import { neon } from "@neondatabase/serverless";

// Neon serverless HTTP driver — ideal for Vercel functions (no pooling issues).
// DATABASE_URL is provided by the Vercel <-> Neon integration (or set it manually).
export const sql = neon(process.env.DATABASE_URL);
