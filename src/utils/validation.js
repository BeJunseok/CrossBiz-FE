import { z } from 'zod';
import { dropdownOptions } from '@/constants/dropdownOptions';

export const getRegisterSchema = (t) =>
  z
    .object({
      loginId: z
        .string()
        .min(1, t('register.basic.validation.loginIdRequired'))
        .min(4, t('register.basic.validation.loginIdMin'))
        .regex(/^[a-z0-9]+$/, t('register.basic.validation.loginIdRegex')),
      password: z
        .string()
        .min(1, t('register.basic.validation.passwordRequired'))
        .min(8, t('register.basic.validation.passwordMin')),
      confirmPassword: z
        .string()
        .min(1, t('register.basic.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('register.basic.validation.passwordMismatch'),
      path: ['confirmPassword'],
    });

export const getPersonalInfoSchema = (t) =>
  z.object({
    name: z.string().min(1, t('register.personalInfo.validation.nameRequired')),
    age: z.enum(
      dropdownOptions.AGE_OPTIONS.map((opt) => opt.key),
      {
        errorMap: () => ({
          message: t('register.personalInfo.validation.ageRequired'),
        }),
      }
    ),
    nationality: z
      .string()
      .min(1, t('register.personalInfo.validation.nationalityRequired')),
    status: z
      .string()
      .min(1, t('register.personalInfo.validation.statusRequired')),
  });

export const visaInfoSchema = z.object({
  bizCategory: z.string().optional(),
  estimatedPeriod: z.string().optional(),
  workExperience: z.string().optional(),
  degree: z.string().optional(),
  koreanLevel: z.string().optional(),
});
