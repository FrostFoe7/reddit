import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormFieldWrapper } from '@/components/common/FormFieldWrapper';
import { Input } from '@/components/common/Input';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  id: string;
  onSubmit: (values: LoginFormValues) => void;
}

export function LoginForm({ id, onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldWrapper id="username" label="Username" error={errors.username?.message}>
        <Input
          id="username"
          type="text"
          placeholder="u/username"
          className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
          {...register('username')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="password" label="Password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
          {...register('password')}
        />
      </FormFieldWrapper>
    </form>
  );
}
