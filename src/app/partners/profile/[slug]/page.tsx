import { Metadata } from 'next';
import { PublicPartnerProfileView } from '@/components/partners/PublicPartnerProfileView';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const name = slug === 'ananya-sharma' ? 'Ananya Sharma' : 'Rahul Sharma';

  return {
    title: `${name} — Verified Courage Partner Profile`,
    description: `Official Courage Library Partner Profile of ${name}. View educational impact, connected schools, badges, and verified credentials.`,
  };
}

export default async function PublicPartnerProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <PublicPartnerProfileView slug={resolvedParams.slug} />;
}
