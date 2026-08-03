import { Metadata } from 'next';
import { PartnersPlatform } from '@/components/partners/PartnersPlatform';

export const metadata: Metadata = {
  title: 'Courage Partner — Official Partnership Infrastructure of Courage Library',
  description: 'The central ecosystem where creators, teachers, school coordinators, NGOs, Telegram admins, WhatsApp communities, LinkedIn voices, and educators collaborate with Courage Library to empower 100,000+ students.',
  openGraph: {
    title: 'Courage Partner — Official Partnership Infrastructure',
    description: 'Join the national movement to expand educational opportunity and merit scholarships across India.',
    url: 'https://courage.org/partners',
    siteName: 'Courage Library',
    type: 'website',
  },
};

export default function PartnersPage() {
  return <PartnersPlatform />;
}
