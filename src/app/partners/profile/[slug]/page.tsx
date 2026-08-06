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
  // Convert slug like 'jan-mohammad' → 'Jan Mohammad'
  const name = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${name} — Verified Courage Partner Profile`,
    description: `Official Courage Library Partner Profile of ${name}. View educational impact, connected schools, badges, and verified credentials.`,
    openGraph: {
      title: `${name} — Courage Partner`,
      description: `View ${name}'s official Courage Partner profile, badges, and student mobilization impact.`,
      type: 'profile',
    },
  };
}

export default async function PublicPartnerProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <PublicPartnerProfileView slug={resolvedParams.slug} />;
}
