"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "@/lib/api";

export type AuthPageMode = "login" | "signup" | "forgot" | "reset";

export function AuthPageContent({ mode }: { mode: AuthPageMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: searchParams.get("email") || "",
    password: "",
    passwordConfirm: "",
    resetCode: "",
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        const next = searchParams.get("next");
        router.replace(next?.startsWith("/") ? next : "/account");
        return;
      }
      if (mode === "signup") {
        if (form.password !== form.passwordConfirm) {
          throw new Error("Passwords do not match.");
        }
        await signup(form.name, form.email, form.password, form.passwordConfirm);
        router.replace("/account");
        return;
      }
      if (mode === "forgot") {
        await forgotPassword(form.email);
        addToast("Password reset code sent to your email.", "success");
        router.push(`/reset-password?email=${encodeURIComponent(form.email)}`);
        return;
      }

      if (form.password !== form.passwordConfirm) {
        throw new Error("Passwords do not match.");
      }
      await verifyResetCode(form.resetCode);
      const response = await resetPassword(form.email, form.password);
      const token =
        typeof response.token === "string" ? response.token : undefined;
      if (!token) throw new Error("The API did not return a session token.");
      window.localStorage.setItem("token", token);
      await refreshUser();
      router.replace("/account");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Request failed.", "error");
    } finally {
      setBusy(false);
    }
  };

  const title: Record<AuthPageMode, string> = {
    login: "Welcome Back",
    signup: "Create Your Account",
    forgot: "Forgot Password",
    reset: "Reset Password",
  };

  return (
    <main className="min-h-[65vh] bg-white flex items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">{title[mode]}</h1>
        <p className="text-gray-600 mb-8">
          {mode === "login" && "Sign in to manage your orders and shopping cart."}
          {mode === "signup" && "Join Bazarna to save your cart and place orders."}
          {mode === "forgot" && "Enter the email address linked to your account."}
          {mode === "reset" && "Use the code sent to your email to set a new password."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <label className="block">
              <span className="block text-sm font-medium mb-2">Name</span>
              <input
                required
                minLength={3}
                autoComplete="name"
                placeholder="Ahmed Talaat"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-4 py-3"
              />
            </label>
          )}

          {mode !== "reset" && (
            <label className="block">
              <span className="block text-sm font-medium mb-2">Email</span>
              <input
                required
                type="email"
                placeholder="ahmed@gmail.com"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-4 py-3"
              />
            </label>
          )}

          {mode === "reset" && (
            <>
              <label className="block">
                <span className="block text-sm font-medium mb-2">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-2">Reset code</span>
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  value={form.resetCode}
                  onChange={(event) => update("resetCode", event.target.value)}
                  className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-4 py-3"
                />
              </label>
            </>
          )}

          {(mode === "login" || mode === "signup" || mode === "reset") && (
            <label className="block">
              <span className="block text-sm font-medium mb-2">
                {mode === "reset" ? "New password" : "Password"}
              </span>
              <input
                required
                minLength={6}
                type="password"
                placeholder="Enter your password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-4 py-3"
              />
            </label>
          )}

          {(mode === "signup" || mode === "reset") && (
            <label className="block">
              <span className="block text-sm font-medium mb-2">Confirm password</span>
              <input
                required
                minLength={6}
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(event) => update("passwordConfirm", event.target.value)}
                className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-4 py-3"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : mode === "signup"
                  ? "Create Account"
                  : mode === "forgot"
                    ? "Send Reset Code"
                    : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-sm text-blue-600">
          {mode === "login" && (
            <>
              <Link href="/forgot-password">Forgot your password?</Link>
              <p className="text-gray-600">
                New to Bazarna? <Link href="/signup" className="text-blue-600">Create an account</Link>
              </p>
            </>
          )}
          {mode === "signup" && (
            <p className="text-gray-600">
              Already registered? <Link href="/login" className="text-blue-600">Sign in</Link>
            </p>
          )}
          {mode === "forgot" && <Link href="/login">Back to sign in</Link>}
          {mode === "reset" && <Link href="/forgot-password">Request another reset code</Link>}
        </div>
      </section>
    </main>
  );
}
