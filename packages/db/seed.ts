import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// Import only the table (for clarity & type safety)
import { products } from './src/schema/product';

// Load env vars
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(sql);

async function main() {
  await db.insert(products).values([
    {
      name: 'Eco Bottle 500ml',
      description: 'Reusable, BPA-free bottle.',
      price: 1500,
      imageUrl: 'https://via.placeholder.com/160?text=Eco+500ml',
      stock: 24,
    },
    {
      name: 'Tritan Sports Jug',
      description: 'Large, robust and made for workouts.',
      price: 220,
      imageUrl: 'https://via.placeholder.com/160?text=Sports+Jug',
      stock: 8,
    },
    {
      name: 'Insulated Flask',
      description: 'Keeps drinks cold or hot for 12h.',
      price: 299,
      imageUrl: 'https://via.placeholder.com/160?text=Flask',
      stock: 12,
    },
  ]);
  console.log('Seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
