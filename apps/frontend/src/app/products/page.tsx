import { fetchProducts } from '@/lib/product';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export const revalidate = 60; // ISR: Rebuild every 60 seconds

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="max-w-5xl mx-auto py-10 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {products.map((p: any) => (
        <Card key={p.id} className="hover:shadow-lg transition">
          <CardHeader>
            <div className="h-40 w-full flex items-center justify-center bg-muted mb-3">
              <Image
                src={p.image_url || "/default-bottle.png"}
                alt={p.name}
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <div className="text-xl font-semibold">{p.name}</div>
            <div className="text-muted-foreground text-sm">{p.description}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">${p.price}</span>
              <span className={p.stock > 0 ? "text-green-600" : "text-red-600"}>
                {p.stock > 0 ? `In Stock: ${p.stock}` : 'Out of Stock'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
