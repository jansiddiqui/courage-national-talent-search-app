import { Metadata } from 'next';
import { PartnersPlatform } from '@/components/partners/PartnersPlatform';

export const metadata: Metadata = {
  title: 'Apply to Become a Courage Partner — Creator Registration',
  description: 'Apply as a YouTuber, Instagram creator, LinkedIn voice, or Telegram EdTech admin to join the official Courage Partner ecosystem.',
};

export default function ApplyPage() {
  return <PartnersPlatform initialView="apply" />;
}
