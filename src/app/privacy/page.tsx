import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Niches Hunter. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[rgba(255,255,255,0.4)] text-sm">
            Last updated: February 14, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Intro */}
          <section>
            <p className="text-[rgba(255,255,255,0.6)] leading-relaxed">
              Niches Hunter (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website{" "}
              <a href="https://nicheshunter.app" className="text-[#00CC6A] hover:underline">
                nicheshunter.app
              </a>
              . This page informs you of our policies regarding the collection, use, and disclosure
              of personal data when you use our service.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">1. Information We Collect</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-white">Email address</strong> when you subscribe to our
                  free or paid newsletter, or create an account.
                </li>
                <li>
                  <strong className="text-white">Payment information</strong> when you subscribe to
                  a paid plan. Payments are processed securely by{" "}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00CC6A] hover:underline">
                    Stripe
                  </a>
                  . We do not store your credit card details.
                </li>
                <li>
                  <strong className="text-white">Usage data</strong> such as pages visited, features
                  used, and interactions with the site, collected through analytics tools.
                </li>
              </ul>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">2. How We Use Your Information</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send you our newsletter (free or paid) with curated app niche opportunities.</li>
                <li>Process payments and manage your subscription.</li>
                <li>Improve our service, content, and user experience.</li>
                <li>Communicate with you about your account or service updates.</li>
              </ul>
            </div>
          </section>

          {/* 3. Newsletter & Emails */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">3. Newsletter & Emails</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                When you subscribe to our newsletter, you agree to receive periodic emails from us.
                You can unsubscribe at any time by clicking the &quot;Unsubscribe&quot; link at the
                bottom of any email we send.
              </p>
              <p>
                We use{" "}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00CC6A] hover:underline">
                  Resend
                </a>
                {" "}to deliver emails. Your email address is shared with Resend solely for the
                purpose of email delivery.
              </p>
            </div>
          </section>

          {/* 4. Analytics & Cookies */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">4. Analytics & Cookies</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>We use the following third-party analytics services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-white">Google Analytics</strong> to understand how visitors
                  interact with our site.
                </li>
                <li>
                  <strong className="text-white">Vercel Analytics</strong> for performance monitoring.
                </li>
              </ul>
              <p>
                These services may use cookies and similar technologies to collect information about
                your browsing activity. You can manage cookie preferences through your browser
                settings.
              </p>
            </div>
          </section>

          {/* 5. Data Sharing */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">5. Data Sharing</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We do not sell, trade, or rent your personal data to third parties. We only share
                your information with the service providers mentioned above (Stripe, Resend, Google
                Analytics, Vercel) strictly for the purposes of operating our service.
              </p>
            </div>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">6. Data Security</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We take reasonable measures to protect your personal information. Your data is stored
                securely using{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00CC6A] hover:underline">
                  Supabase
                </a>
                {" "}infrastructure with encryption at rest and in transit. However, no method of
                transmission over the Internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </div>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">7. Your Rights</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Unsubscribe from our newsletters at any time.</li>
                <li>Request a copy of your data in a portable format.</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:support@arianeconcept.fr" className="text-[#00CC6A] hover:underline">
                  support@arianeconcept.fr
                </a>
                .
              </p>
            </div>
          </section>

          {/* 8. Data Retention */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">8. Data Retention</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We retain your personal data for as long as your account is active or as needed to
                provide you with our services. If you unsubscribe or request deletion, we will remove
                your data within 30 days.
              </p>
            </div>
          </section>

          {/* 9. Changes */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">9. Changes to This Policy</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by updating the &quot;Last updated&quot; date at the top of this page.
              </p>
            </div>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">10. Contact Us</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@arianeconcept.fr" className="text-[#00CC6A] hover:underline">
                  support@arianeconcept.fr
                </a>
                .
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="font-bold text-sm tracking-widest">NICHES HUNTER</span>
          </div>
          <div className="flex gap-8 text-sm text-[rgba(255,255,255,0.4)]">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="https://x.com/nicheshunter" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.2)]">
            &copy; 2026 Niches Hunter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
