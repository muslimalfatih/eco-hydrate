import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function fetchProducts() {
  const cookieStore = cookies();

  // Create the Supabase client for the server
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: await cookieStore 
    }
  );

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
