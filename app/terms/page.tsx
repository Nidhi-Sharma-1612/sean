import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/lib/data/legal.json";
import { getPageSections, objList, str } from "@/lib/cms";
import { parseLegalBody, type LegalSection } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you use the GSM Cabin Rentals website.",
};

const DEFAULT_SECTIONS: LegalSection[] = legal.terms;

export default async function TermsPage() {
  const sections = await getPageSections("terms");
  const content = sections.content ?? {};
  const title = str(content, "title", "Terms & Conditions");
  const description = str(content, "description", "Please read these terms carefully before using our service.");
  const editedSections = objList(content, "sections", ["id", "title", "body"] as const, []);
  const legalSections: LegalSection[] =
    editedSections.length === DEFAULT_SECTIONS.length
      ? editedSections.map((s) => ({ id: s.id, title: s.title, blocks: parseLegalBody(s.body) }))
      : DEFAULT_SECTIONS;

  return <LegalPage title={title} description={description} sections={legalSections} />;
}
