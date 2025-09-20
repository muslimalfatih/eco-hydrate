import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export { products } from './src/schema/product';

const sql = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(sql);