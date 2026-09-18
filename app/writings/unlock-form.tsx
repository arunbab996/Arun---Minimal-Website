"use client";

import { useActionState } from "react";
import { unlock, type UnlockState } from "./actions";

export default function UnlockForm() {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlock, {});

  return (
    <form action={action} className="fade-up" style={{ animationDelay: "0.35s" }}>
      <label htmlFor="writings-password" className="block text-[15px] text-neutral-400 mb-3">
        This one&apos;s behind a door.
      </label>
      <div className="flex gap-2">
        <input
          id="writings-password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder="Password"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "writings-error" : undefined}
          className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-[15px] text-[#e5e5e5] placeholder:text-neutral-500 outline-none focus:border-neutral-500 transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-[15px] text-neutral-200 transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "…" : "Enter"}
        </button>
      </div>
      {state.error && (
        <p id="writings-error" role="alert" className="mt-3 text-[13px] text-neutral-500">
          {state.error}
        </p>
      )}
    </form>
  );
}
