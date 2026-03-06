import { Link, useNavigate } from 'react-router-dom';
import { SubmitButton } from '@/components/common/SubmitButton';
import { useLogin } from '@/hooks/api/useAuth';
import { toast } from 'sonner';
import { AuthLayout } from '@/pages/auth/components/AuthLayout';
import { LoginForm, type LoginFormValues } from '@/pages/auth/components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoading } = useLogin();

  const handleSubmit = (values: LoginFormValues) => {
    login(
      values,
      {
        onSuccess: () => {
          toast.success('Welcome back!');
          navigate('/');
        },
        onError: error => {
          const message = error instanceof Error ? error.message : 'Invalid username or password';
          toast.error(message);
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Log In"
      subtitle="By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy."
      footer={
        <>
          <SubmitButton
            form="login-form"
            className="w-full h-12 rounded-full font-bold text-base"
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Log In
          </SubmitButton>
          <div className="text-sm text-center font-medium">
            New to Reddit?{' '}
            <Link to="/auth/register" className="text-primary hover:underline font-bold">
              Sign Up
            </Link>
          </div>
        </>
      }
    >
      <LoginForm id="login-form" onSubmit={handleSubmit} />
      <div className="pt-2">
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
          onClick={() => navigate('/auth/register')}
        >
          Forgot password?
        </button>
      </div>
    </AuthLayout>
  );
}
