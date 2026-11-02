import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/lib/data/legal.json";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you use the GSM Cabin Rentals website.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="Please read these terms carefully before using our service."
      sections={legal.terms}
    />
  );
}
