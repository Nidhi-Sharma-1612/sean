import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/lib/data/legal.json";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GSM Cabin Rentals collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy & Cookie Policy"
      description="How we collect, use and protect your information."
      sections={legal.privacy}
    />
  );
}
