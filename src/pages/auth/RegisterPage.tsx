import { Link, useNavigate } from 'react-router-dom';
import { SubmitButton } from '@/components/common/SubmitButton';
import { useRegister } from '@/hooks/api/useAuth';
import { toast } from 'sonner';
import { AuthLayout } from '@/pages/auth/components/AuthLayout';
import { RegisterForm, type RegisterFormValues } from '@/pages/auth/components/RegisterForm';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending: isLoading } = useRegister();

  const handleSubmit = (values: RegisterFormValues) => {
    register(
      { username: values.username, email: values.email, password: values.password },
      {
        onSuccess: () => {
          toast.success('Account created successfully!');
          navigate('/');
        },
        onError: error => {
          const message =
            error instanceof Error ? error.message : 'Registration failed. Try again.';
          toast.error(message);
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Create an account to join the community."
      footer={
        <>
          <SubmitButton
            form="register-form"
            className="w-full h-12 rounded-full font-bold text-base"
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Sign Up
          </SubmitButton>
          <div className="text-sm text-center font-medium">
            Already a redditor?{' '}
            <Link to="/auth/login" className="text-primary hover:underline font-bold">
              Log In
            </Link>
          </div>
        </>
      }
    >
      <RegisterForm id="register-form" onSubmit={handleSubmit} />
      <div className="text-[13px] text-muted-foreground leading-relaxed">
        By continuing, you agree to our User Agreement and Privacy Policy. You may receive email
        updates from us.
      </div>
      <button
        type="button"
        className="text-sm font-semibold text-primary hover:underline text-left"
        onClick={() => navigate('/auth/login')}
      >
        Already have an account?
      </button>
    </AuthLayout>
  );
}
