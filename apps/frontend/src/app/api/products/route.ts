import { NextRequest, NextResponse } from "next/server";
import { db, products } from "@eco-hydrate/db";
import { ProductSchema } from "@/lib/validation/product";
import { getUser, isAdmin } from "@/lib/auth/supabase-server";

export async function GET() {
  try {
    const result = await db.select().from(products);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = ProductSchema.parse({
      ...body,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
    });
    const [inserted] = await db.insert(products).values(parsed).returning();
    return NextResponse.json(inserted);
  } catch (err: any) {
    if (err.constructor.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
