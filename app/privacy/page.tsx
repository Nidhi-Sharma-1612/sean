import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/lib/data/legal.json";
import { getPageSections, objList, str } from "@/lib/cms";
import { parseLegalBody, type LegalSection } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GSM Cabin Rentals collects, uses and protects your information.",
};

const DEFAULT_SECTIONS: LegalSection[] = legal.privacy;

export default async function PrivacyPage() {
  const sections = await getPageSections("privacy");
  const content = sections.content ?? {};
  const title = str(content, "title", "Privacy & Cookie Policy");
  const description = str(content, "description", "How we collect, use and protect your information.");
  const editedSections = objList(content, "sections", ["id", "title", "body"] as const, []);
  const legalSections: LegalSection[] =
    editedSections.length === DEFAULT_SECTIONS.length
      ? editedSections.map((s) => ({ id: s.id, title: s.title, blocks: parseLegalBody(s.body) }))
      : DEFAULT_SECTIONS;

  return <LegalPage title={title} description={description} sections={legalSections} />;
}
