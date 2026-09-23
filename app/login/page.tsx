"use client";

import { useState, useTransition } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
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
              Sign in to your account
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
                placeholder="admin@example.com"
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
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
