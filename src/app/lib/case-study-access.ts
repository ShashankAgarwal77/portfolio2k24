import { createHash, createHmac, timingSafeEqual } from "crypto";

export const AUDIT360_ACCESS_COOKIE = "sa_audit360_access";

const password = () => process.env.AUDIT360_PASSWORD || "";

const digest = (value: string) => createHash("sha256").update(value).digest();

const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/* Keyed on the password itself, so changing AUDIT360_PASSWORD revokes every
   cookie already handed out. */
export function audit360AccessToken(): string {
  return createHmac("sha256", password()).update("audit360-access-v1").digest("base64url");
}

export function audit360PasswordMatches(input: string): boolean {
  const expected = password();
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function hasAudit360Access(token: string | undefined): boolean {
  if (!password() || !token) return false;
  return safeEqual(token, audit360AccessToken());
}
