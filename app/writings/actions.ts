"use server";

import { revalidatePath } from "next/cache";
import { checkPassword, clearUnlockedCookie, setUnlockedCookie } from "./auth";

export type UnlockState = { error?: string };

export async function unlock(_prev: UnlockState, form: FormData): Promise<UnlockState> {
  const attempt = String(form.get("password") ?? "");
  if (!checkPassword(attempt)) {
    return { error: "That's not it." };
  }
  await setUnlockedCookie();
  revalidatePath("/writings");
  return {};
}

export async function lock(): Promise<void> {
  await clearUnlockedCookie();
  revalidatePath("/writings");
}
