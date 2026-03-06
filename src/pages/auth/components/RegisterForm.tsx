import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormFieldWrapper } from '@/components/common/FormFieldWrapper';
import { Input } from '@/components/common/Input';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  id: string;
  onSubmit: (values: RegisterFormValues) => void;
}

export function RegisterForm({ id, onSubmit }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
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

      <FormFieldWrapper id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="me@example.com"
          className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
          {...register('email')}
        />
      </FormFieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FormFieldWrapper id="password" label="Password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
            {...register('password')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          id="confirmPassword"
          label="Confirm"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
            {...register('confirmPassword')}
          />
        </FormFieldWrapper>
      </div>
    </form>
  );
}
