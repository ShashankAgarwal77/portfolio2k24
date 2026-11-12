import { createHash, createHmac, timingSafeEqual } from "crypto";

/* Password-gated case studies, each with its own password env var. */
const PASSWORD_ENV = {
  audit360: "AUDIT360_PASSWORD",
  bcas: "BCAS_PASSWORD",
} as const;

export type LockedStudy = keyof typeof PASSWORD_ENV;

export const isLockedStudy = (s: string): s is LockedStudy => s in PASSWORD_ENV;

export const passwordEnvName = (study: LockedStudy) => PASSWORD_ENV[study];

export const accessCookie = (study: LockedStudy) => `sa_${study}_access`;

const password = (study: LockedStudy) => process.env[PASSWORD_ENV[study]] || "";

const digest = (value: string) => createHash("sha256").update(value).digest();

const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/* Keyed on the password itself, so changing a study's password revokes every
   cookie already handed out for it. */
export function accessToken(study: LockedStudy): string {
  return createHmac("sha256", password(study)).update(`${study}-access-v1`).digest("base64url");
}

export function passwordMatches(study: LockedStudy, input: string): boolean {
  const expected = password(study);
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function hasAccess(study: LockedStudy, token: string | undefined): boolean {
  if (!password(study) || !token) return false;
  return safeEqual(token, accessToken(study));
}
