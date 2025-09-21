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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  EyeIcon, 
  EyeOffIcon, 
  UserPlusIcon, 
  MailIcon, 
  LockIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  LeafIcon,
  ShieldCheckIcon
} from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Client-side validation with toast feedback
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      toast.error('Validation Error', {
        description: 'Passwords do not match. Please check and try again.',
      });
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      toast.error('Password Too Short', {
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }

    if (passwordStrength < 50) {
      setError('Password is too weak');
      setLoading(false);
      toast.error('Weak Password', {
        description: 'Please create a stronger password with uppercase, lowercase, and numbers.',
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...', {
      description: 'Please wait while we set up your account'
    });

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });
    
    setLoading(false);
    
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    if (error) {
      setError(error.message);
      toast.error('Registration failed', {
        description: error.message,
        action: {
          label: 'Try again',
          onClick: () => setError(null),
        },
      });
    } else {
      setMessage('Check your email for a confirmation link!');
      toast.success('Account created successfully!', {
        description: 'Please check your email for a confirmation link to activate your account.',
        duration: 5000,
        action: {
          label: 'Resend Email',
          onClick: () => {
            toast.info('Resend feature coming soon!');
          },
        },
      });
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
            <p className="text-muted-foreground text-sm">Create your account to get started</p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <CheckCircle2Icon className="h-4 w-4" />
                <AlertTitle>Registration Successful!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
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
                <Label htmlFor="password">
                  <LockIcon className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Password strength</span>
                      <span className="text-xs text-muted-foreground">
                        {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    <Progress 
                      value={passwordStrength} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2Icon className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircleIcon className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-destructive">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !passwordsMatch || passwordStrength < 50}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
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
