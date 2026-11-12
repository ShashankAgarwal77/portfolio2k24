import { cookies } from "next/headers";
import type { Metadata } from "next";
import Audit360Content from "./content.mdx";
import { CaseStudyLock, UnlockReveal } from "@/app/components/CaseStudyLock";
import { accessCookie, hasAccess } from "@/app/lib/case-study-access";

export const metadata: Metadata = {
  title: "I rewrote a national UX standard so a machine could read it",
  description:
    "Audit360, an AI audit platform for India's 60,000 government websites. The tool was the easy half. Making 480 guidelines machine-readable was the work.",
};

export default async function Audit360Page() {
  const token = (await cookies()).get(accessCookie("audit360"))?.value;

  if (!hasAccess("audit360", token)) return <CaseStudyLock study="audit360" />;

  return (
    <UnlockReveal>
      <Audit360Content />
    </UnlockReveal>
  );
}
