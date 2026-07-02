import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type registerFormValues } from "./Schema-First";

export function ZodResolverForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<registerFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: registerFormValues) => {
    console.log(`Форму було надіслано: `, data);
    alert("Форма успішно відправлена!");
    reset();
  };

  const values = watch();
  const getInputClass = (fielId: keyof registerFormValues) => {
    if (errors[fielId]) return "input-control error";

    if (values[fielId] && !errors[fielId]) {
      return "input-control succes";
    }

    return "input-control";
  };

  return (
    <div className="container">
      <form id="form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Registration</h1>

        {/* Username */}
        <div className={getInputClass("username")}>
          <label htmlFor="username">Ім'я користувача</label>
          <input id="username" {...register("username")} type="text" />
          <div className="error">{errors.username?.message}</div>
        </div>

        {/* Email */}
        <div className={getInputClass("email")}>
          <label htmlFor="email">Пошта</label>
          <input id="email" {...register("email")} type="text" />
          <div className="error">{errors.email?.message}</div>
        </div>

        {/* Password */}
        <div className={getInputClass("password")}>
          <label htmlFor="password">Пароль</label>
          <input id="password" {...register("password")} type="password" />
          <div className="error">{errors.password?.message}</div>
        </div>

        {/* Password Confirm */}
        <div className={getInputClass("passwordComfirm")}>
          <label htmlFor="passwordComfirm">Підтверждження пароля</label>
          <input
            id="passwordComfirm"
            {...register("passwordComfirm")}
            type="password"
          />
          <div className="error">{errors.passwordComfirm?.message}</div>
        </div>

        <button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
          {isSubmitting ? "Іде надсилання..." : "Зареєструватися"}
        </button>
      </form>
    </div>
  );
}
