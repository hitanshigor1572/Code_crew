"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, "You must accept terms & privacy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const passwordVal = watch("password") || "";
  const termsVal = watch("terms");

  // Calculate live password strength
  const strengthScore = React.useMemo(() => {
    let score = 0;
    if (passwordVal.length >= 8) score += 25;
    if (/[A-Z]/.test(passwordVal)) score += 25;
    if (/[0-9]/.test(passwordVal)) score += 25;
    if (/[^A-Za-z0-9]/.test(passwordVal)) score += 25;
    return score;
  }, [passwordVal]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success("Account created successfully! Welcome to GlobeTrotter.");
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Start Your Journey
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Join thousands of travelers planning seamless, unforgettable adventures.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Alexandre Morgan"
              {...register("fullName")}
              className={`pl-10 h-12 rounded-2xl ${errors.fullName ? "border-danger" : ""}`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-danger font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="email"
              placeholder="alex@globetrotter.io"
              {...register("email")}
              className={`pl-10 h-12 rounded-2xl ${errors.email ? "border-danger" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-danger font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`pl-10 pr-10 h-12 rounded-2xl ${errors.password ? "border-danger" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Strength Bar */}
          {passwordVal && (
            <div className="space-y-1 pt-1">
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strengthScore <= 25
                      ? "bg-danger w-1/4"
                      : strengthScore <= 50
                      ? "bg-amber-500 w-2/4"
                      : strengthScore <= 75
                      ? "bg-sky-500 w-3/4"
                      : "bg-emerald-500 w-full"
                  }`}
                />
              </div>
              <p className="text-[10px] text-zinc-400">
                Strength: {strengthScore >= 75 ? "Strong" : strengthScore >= 50 ? "Medium" : "Weak"}
              </p>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-danger font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`pl-10 h-12 rounded-2xl ${errors.confirmPassword ? "border-danger" : ""}`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-danger font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2 py-1">
          <Checkbox
            id="terms"
            checked={termsVal}
            onCheckedChange={(checked) => setValue("terms", !!checked)}
            className="mt-0.5"
          />
          <label
            htmlFor="terms"
            className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight cursor-pointer"
          >
            I agree to the{" "}
            <span className="text-primary font-semibold hover:underline">Terms of Service</span> and{" "}
            <span className="text-primary font-semibold hover:underline">Privacy Policy</span>.
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-danger font-medium">{errors.terms.message}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl font-bold text-sm shadow-md gap-2"
        >
          {isLoading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
