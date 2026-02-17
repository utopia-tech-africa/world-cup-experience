'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/services/authService';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await login(values);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      let message = 'Invalid email or password';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { error?: string }; status?: number } }).response;
        message = res?.data?.error ?? (res?.status === 401 ? 'Invalid email or password' : message);
      } else if (err instanceof Error) {
        message = err.message;
      }
      if (message === 'Network Error' || message.toLowerCase().includes('network')) {
        message = 'Cannot reach server. Check that the backend is running and NEXT_PUBLIC_API_URL is set.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Admin login</h1>
        <FieldDescription>
          Enter your credentials to access the dashboard
        </FieldDescription>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            {...form.register('email')}
          />
          {form.formState.errors.email?.message && (
            <p className="text-destructive text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Password</FieldLabel>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...form.register('password')}
          />
          {form.formState.errors.password?.message && (
            <p className="text-destructive text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </Field>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </FieldGroup>
    </form>
  );
}
