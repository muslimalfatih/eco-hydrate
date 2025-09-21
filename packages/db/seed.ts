import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from './src/schema/product';

import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(sql);

async function main() {
  await db.insert(products).values([
    {
      name: 'EcoFlow Bottle 500ml',
      description: 'Premium stainless steel water bottle with leak-proof design. Perfect for daily hydration.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
      stock: 45,
    },
    {
      name: 'HydroSport Pro 750ml',
      description: 'Professional sports water bottle with ergonomic grip and push-pull cap.',
      price: 18.95,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      stock: 32,
    },
    {
      name: 'ThermoMax Insulated Flask 1L',
      description: 'Double-wall vacuum insulated flask. Keeps drinks hot for 12h, cold for 24h.',
      price: 35.00,
      imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
      stock: 18,
    },
    {
      name: 'GlassPure Borosilicate 400ml',
      description: 'Premium borosilicate glass bottle with silicone sleeve protection.',
      price: 22.50,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
      stock: 28,
    },
    {
      name: 'AquaFlex Collapsible 600ml',
      description: 'Innovative collapsible silicone bottle. Space-saving design for travelers.',
      price: 16.75,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      stock: 40,
    },
    {
      name: 'UltraLight Titanium 350ml',
      description: 'Ultra-lightweight titanium bottle for outdoor adventures and hiking.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
      stock: 12,
    },
    {
      name: 'KidsEco Fun Bottle 300ml',
      description: 'Colorful, safe, and fun water bottle designed specifically for children.',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      stock: 55,
    },
  ]);
  
  console.log('✅ Seeding complete! 7 products added to database.');
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
