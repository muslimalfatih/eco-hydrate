'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  SendIcon, 
  UserIcon, 
  MailIcon, 
  MessageSquareIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  LoaderIcon
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    watch 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const watchedMessage = watch('message', '');
  const messageLength = watchedMessage?.length || 0;

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    // Show loading toast
    const loadingToast = toast.loading('Sending your message...', {
      description: 'Please wait while we process your contact request'
    });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (response.ok) {
        reset();
        setSubmitSuccess(true);
        
        // Show success toast
        toast.success('Message sent successfully!', {
          description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
          duration: 5000,
          action: {
            label: 'Send Another',
            onClick: () => {
              setSubmitSuccess(false);
              toast.info('Ready for your next message');
            },
          },
        });
        
        // Track the contact form submission
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('contact_form_submitted', {
            name: data.name,
            email: data.email,
            message_length: data.message.length,
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast.error('Failed to send message', {
        description: errorMessage,
        action: {
          label: 'Try Again',
          onClick: () => {
            toast.info('Please check your details and try again');
          },
        },
      });
      
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormReset = () => {
    reset();
    setSubmitSuccess(false);
    toast.info('Form cleared', {
      description: 'All fields have been reset'
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Get in Touch</CardTitle>
        <CardDescription>
          Have a question about our eco-friendly water bottles? We'd love to hear from you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitSuccess && (
          <Alert className="mb-6">
            <CheckCircle2Icon className="h-4 w-4" />
            <AlertDescription>
              Your message has been sent successfully! We'll get back to you soon.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              <UserIcon className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <Alert variant="destructive" className="py-2">
                <AlertCircleIcon className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  {errors.name.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              <MailIcon className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              {...register('email')}
              type="email"
              placeholder="Enter your email address"
              disabled={isSubmitting}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <Alert variant="destructive" className="py-2">
                <AlertCircleIcon className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  {errors.email.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">
                <MessageSquareIcon className="h-4 w-4" />
                Message
              </Label>
              <span className="text-xs text-muted-foreground">
                {messageLength}/500
              </span>
            </div>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about your inquiry, feedback, or how we can help you..."
              rows={4}
              disabled={isSubmitting}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <Alert variant="destructive" className="py-2">
                <AlertCircleIcon className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  {errors.message.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleFormReset}
              disabled={isSubmitting}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
