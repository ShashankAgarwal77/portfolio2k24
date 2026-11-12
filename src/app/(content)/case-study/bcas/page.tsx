import { cookies } from "next/headers";
import type { Metadata } from "next";
import BCASContent from "./content.mdx";
import { CaseStudyLock, UnlockReveal } from "@/app/components/CaseStudyLock";
import { accessCookie, hasAccess } from "@/app/lib/case-study-access";

export const metadata: Metadata = {
  title: "India's aviation security compliance, on one traceable platform",
  description:
    "eBCAS 2.0: one platform where a national aviation security regulator and the airlines, airports and ground handlers it oversees review compliance together, with every action traced.",
};

export default async function BCASPage() {
  const token = (await cookies()).get(accessCookie("bcas"))?.value;

  if (!hasAccess("bcas", token)) return <CaseStudyLock study="bcas" />;

  return (
    <UnlockReveal>
      <BCASContent />
    </UnlockReveal>
  );
}
