'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { SITE_CONFIG, CONTACT_API_ENDPOINT } from '@/lib/constants';
import type { ContactFormData } from '@/lib/types';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch(CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeader title="Get In Touch" subtitle="Have a question? We'd love to hear from you" accent="primary" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-lg bg-[var(--accent-primary-dim)] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Email</p>
                  <p className="text-sm text-[var(--text-primary)]">{SITE_CONFIG.email}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-lg bg-[var(--accent-sage-dim)] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-sage)" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Address</p>
                  <p className="text-sm text-[var(--text-primary)]">{SITE_CONFIG.address}</p>
                </div>
              </div>
            </div>

            <p className="text-mono text-[0.65rem] text-center lg:text-left">
              Response time: Usually within 24 hours
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text" name="name" placeholder="Your Name" required
                  value={formData.name} onChange={handleChange}
                  className="form-input"
                />
                <input
                  type="email" name="email" placeholder="Your Email" required
                  value={formData.email} onChange={handleChange}
                  className="form-input"
                />
              </div>
              <input
                type="text" name="subject" placeholder="Subject" required
                value={formData.subject} onChange={handleChange}
                className="form-input"
              />
              <textarea
                name="message" placeholder="Your Message" required rows={5}
                value={formData.message} onChange={handleChange}
                className="form-input resize-none"
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Send Message
              </Button>

              {status === 'success' && (
                <p className="text-sm text-[var(--accent-sage)] text-center">
                  ✓ Message sent successfully! We&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-[var(--accent-coral)] text-center">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
