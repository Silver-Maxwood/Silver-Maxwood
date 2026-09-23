"use client";

import { useState, useTransition } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const action = isLogin ? login : signup;
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-silver-50 p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl border border-silver-200/60">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-forest-900 mb-2">
              Silver Maxwood Dairies
            </h1>
            <p className="text-silver-600">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1.5">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                className="input"
                placeholder="farmer@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-900 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-alert-red/10 text-alert-red text-sm rounded-lg border border-alert-red/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-pasture-600 hover:bg-pasture-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-silver-600 hover:text-forest-900 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
