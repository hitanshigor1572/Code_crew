"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { login } from "@/lib/services/user.service";
import { API_URL, saveToken } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    if (token) {
      saveToken(token);
      router.replace("/dashboard");
    } else if (error === "google_auth_failed") {
      toast.error("Google sign-in could not be completed");
      window.history.replaceState({}, "", "/login");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alex.morgan@globetrotter.io",
      password: "password123",
      rememberMe: true,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try { const user = await login(data.email, data.password); toast.success(`Welcome back, ${user.name}!`); router.push("/dashboard"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to sign in"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your credentials to manage your itineraries & wanderlust.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
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
              className={`pl-10 h-12 rounded-2xl ${errors.email ? "border-danger focus-visible:ring-danger/20" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-danger font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast.info("Password reset link sent to your email in demo mode.")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`pl-10 pr-10 h-12 rounded-2xl ${errors.password ? "border-danger focus-visible:ring-danger/20" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-danger font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2 py-1">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
          />
          <label
            htmlFor="rememberMe"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-300 cursor-pointer"
          >
            Remember me on this device for 30 days
          </label>
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl font-bold text-sm shadow-md gap-2"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to GlobeTrotter</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Social Authentication */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-400 font-semibold">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => { window.location.href = `${API_URL}/auth/google`; }}
            className="w-full h-11 rounded-2xl text-xs font-semibold"
          >
            Google
          </Button>
        </div>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          Create free account
        </Link>
      </p>
    </div>
  );
}
