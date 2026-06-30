import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Verify CNTS Candidate Registration",
  robots: {
    index: false,
    follow: true,
  },
};

interface VerifyPageProps {
  params: Promise<{ candidateId: string }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { candidateId } = await params;
  return <VerifyClient candidateId={candidateId} />;
}
