import { setAuthTokens } from '@/utils/storage';
import { useLogin } from '../api/login';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { mapAuthUserToStore } from '../types/auth';
import type { ApiError } from '@/types/ApiError';
import { useUserStore } from '@/stores/UserStore';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const basename = import.meta.env.VITE_BASE_PATH || '/debtbox-admin/';

export const Login = () => {
  const { t } = useTranslation();
  const setUser = useUserStore((s) => s.setUser);

  const { mutate: loginMutation, isPending } = useLogin({
    onSuccess: (data) => {
      const d = data?.data;
      if (d?.accessToken && d?.refreshToken) {
        setAuthTokens(d.accessToken, d.refreshToken);
        if (d.user) {
          setUser(mapAuthUserToStore(d.user));
        }
        toast.success(t('login.success', 'Signed in successfully'));
        // Full page redirect so AppRoutes re-reads cookie and shows protected routes
        window.location.replace(`${basename.replace(/\/$/, '')}/`);
      }
    },
    onError: (error: ApiError) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error as { message?: string })?.message ??
        t('login.error', 'Invalid email or password. Please try again.');
      toast.error(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation(
      { login: data.email, password: data.password },
      { onError: () => { } }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Debtbox Admin
          </h1>
          <p className="text-gray-600">{t('login.subtitle', 'Sign in to access your dashboard')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('login.email', 'Email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  placeholder={t('login.emailPlaceholder', 'Enter your email')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all invalid:border-red-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {t(errors.email.message ?? 'validation.emailRequired')}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('login.password', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all invalid:border-red-500"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {t(errors.password.message ?? 'validation.passwordRequired')}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {t('login.rememberMe', 'Remember me')}
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                {t('login.forgotPassword', 'Forgot password?')}
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('login.signingIn', 'Signing in...')}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{t('login.signIn', 'Sign In')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t('login.footer', '© 2024 Debtbox. All rights reserved.')}
        </p>
      </div>
    </div>
  );
};
