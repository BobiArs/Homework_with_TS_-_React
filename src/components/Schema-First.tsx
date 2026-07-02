import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Ім'я занадто коротке")
      .nonempty("Поле обов'язкове"),
    email: z.string().email("Некоректний email").nonempty("Поле обов'язкове"),
    password: z
      .string()
      .min(8, "Мінімум 8 символів")
      .nonempty("Поле обов'язкове"),
    passwordComfirm: z.string().nonempty("Поле обов'язкове"),
  })
  .refine((data) => data.password === data.passwordComfirm, {
    message: "Паролі не збігаються",
    path: ["passwordComfirm"], // помилка запишеться на поле підтвердження пароля
  });

export type registerFormValues = z.infer<typeof registerSchema>;
