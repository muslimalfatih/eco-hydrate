import { pgTable, uuid, varchar, text, decimal, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  stock: integer('stock').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
