import { z } from 'zod';
import { dropdownOptions } from '@/constants/dropdownOptions';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, '아이디를 입력해주세요.')
      .min(4, '아이디는 4자 이상이어야 합니다.')
      .regex(/^[a-z0-9]+$/, '아이디는 영문 소문자, 숫자만 사용 가능합니다.'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 8자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호를 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export const personalInfoSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  age: z.enum(dropdownOptions.AGE_OPTIONS, {
    errorMap: () => ({ message: '나이를 선택해주세요.' }),
  }),
  nationality: z.string().min(1, '국적을 선택하거나 입력해주세요.'),
  businessInfo: z.string().min(1, '사업자 정보를 선택하거나 입력해주세요.'),
});

export const visaInfoSchema = z.object({
  residenceStatus: z.string().optional(),
  expectedStayPeriod: z.string().optional(),
  workExperience: z.string().optional(),
  degree: z.string().optional(),
  koreanProficiency: z.string().optional(),
});
