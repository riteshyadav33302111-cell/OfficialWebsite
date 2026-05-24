import type { Metadata } from 'next';
import ContactFormFull from '@/components/contact/ContactFormFull';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Web & Coding Club NIT Patna. Reach out for collaborations, feedback, or to join our community.',
};

export default function ContactPage() {
  return (
    <main>
      <ContactFormFull />
    </main>
  );
}
