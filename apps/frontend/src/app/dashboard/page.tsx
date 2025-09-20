'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabaseBrowser } from '../../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.email}</CardTitle>
          <div className="text-muted-foreground mt-2 text-sm">Here’s your dashboard overview.</div>
        </CardHeader>
        <CardContent>
          <ul className="mb-4 space-y-3">
            {/* <li><b>User ID:</b> {user.id}</li> */}
            {/* Add more user/account info or stats here */}
          </ul>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-accent">
              <CardHeader>
                <CardTitle className="text-lg">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">0</span>
                <span className="ml-2 text-muted-foreground">Completed</span>
              </CardContent>
            </Card>
            <Card className="bg-accent">
              <CardHeader>
                <CardTitle className="text-lg">Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">0</span>
                <span className="ml-2 text-muted-foreground">Items</span>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={async () => {
              const supabase = supabaseBrowser();
              await supabase.auth.signOut();
              router.replace('/login');
            }}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
