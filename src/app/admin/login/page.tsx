'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingButton from '@/components/ui/LoadingButton';
import { useToast } from '@/components/ui/Toast';
import { loginAdmin } from '@/lib/admin-api';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Informe seu usuário ou e-mail de acesso'),
  password: z.string().min(1, 'Informe sua senha'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { error: toastError, warning: toastWarning } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await loginAdmin(data);
      setAuth(response.access_token, {
        id: response.user.id,
        name: response.user.username,
        email: response.user.email,
      });
      router.push('/admin/cardapio');
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Credenciais inválidas. Tente novamente.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark p-4">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(201, 168, 106, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 168, 106, 0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/logotipo.png" alt="Logo Chef Lucas Medeiros" className="h-28 w-auto object-contain" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-brand-light">
            SISTEMA PERSONAL CHEF
          </h1>
          <p className="mt-1 text-sm text-brand-light/50">
            [ Área Administrativa ]
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-brand-light/10 bg-brand-light/[0.03] p-6 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Login */}
            <div>
              <label htmlFor="login-username" className="mb-1.5 block text-sm font-medium text-brand-light/70">
                Login:
              </label>
              <input
                id="login-username"
                type="text"
                placeholder="digite seu usuário ou e-mail de acesso"
                autoComplete="username"
                {...register('emailOrUsername')}
                className={`w-full rounded-xl border bg-brand-light/[0.05] px-4 py-3 text-sm text-brand-light placeholder:text-brand-light/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/40 ${
                  errors.emailOrUsername ? 'border-red-500/50' : 'border-brand-light/10'
                }`}
              />
              {errors.emailOrUsername && (
                <p className="mt-1 text-xs text-red-400">{errors.emailOrUsername.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-brand-light/70">
                Senha:
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-brand-light/[0.05] px-4 py-3 pr-12 text-sm text-brand-light placeholder:text-brand-light/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/40 ${
                    errors.password ? 'border-red-500/50' : 'border-brand-light/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-brand-light/40 transition-colors hover:text-brand-light/70"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="secondary"
              fullWidth
              className="!mt-6 !py-3.5 text-base font-bold tracking-wide"
            >
              ENTRAR
            </LoadingButton>
          </form>

          {/* Forgot Password */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => toastWarning('Para redefinir sua senha, entre em contato com o administrador do sistema.')}
              className="text-sm text-brand-secondary/60 transition-colors hover:text-brand-secondary"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
