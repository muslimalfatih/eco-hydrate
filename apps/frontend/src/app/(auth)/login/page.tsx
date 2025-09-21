'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  EyeIcon, 
  EyeOffIcon, 
  LogInIcon, 
  MailIcon, 
  LockIcon,
  AlertCircleIcon,
  LeafIcon
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Show loading toast
    const loadingToast = toast.loading('Signing you in...', {
      description: 'Please wait while we verify your credentials'
    });
    
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    setLoading(false);
    
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    if (error) {
      setError(error.message);
      toast.error('Sign in failed', {
        description: error.message,
        action: {
          label: 'Try again',
          onClick: () => setError(null),
        },
      });
    } else {
      toast.success('Welcome back!', {
        description: 'You have been successfully signed in',
        action: {
          label: 'Go to Dashboard',
          onClick: () => router.push('/dashboard'),
        },
      });
      
      // Small delay to show success toast before navigation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
            <LeafIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Eco-Hydrate</h1>
            <p className="text-muted-foreground text-sm">Welcome back to your dashboard</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <MailIcon className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    <LockIcon className="h-4 w-4" />
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0 font-normal text-muted-foreground"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Back to homepage
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
