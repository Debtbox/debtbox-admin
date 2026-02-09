import type { TFunction } from 'i18next';
import { z } from 'zod';

export const loginSchema = (t: TFunction) => z.object({
  email: z
    .string()
    .min(1, t('validation.emailRequired'))
    .email(t('validation.emailInvalid')),
  password: z
    .string()
    .min(1, t('validation.passwordRequired'))
    .min(8, t('validation.passwordMinLength')),
});

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
