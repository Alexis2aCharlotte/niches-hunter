import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Niches Hunter. Read our terms and conditions for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms of Service
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
              Welcome to Niches Hunter. By accessing or using our website at{" "}
              <a href="https://nicheshunter.app" className="text-[#00CC6A] hover:underline">
                nicheshunter.app
              </a>
              {" "}and our services, you agree to be bound by these Terms of Service. If you do not
              agree with any part of these terms, please do not use our service.
            </p>
          </section>

          {/* 1. Description of Service */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">1. Description of Service</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                Niches Hunter is a platform that helps indie developers and entrepreneurs discover
                profitable app niches in the iOS App Store. Our service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daily analysis of App Store trends and opportunities.</li>
                <li>A free newsletter with curated niche insights.</li>
                <li>A paid (Pro) newsletter with in-depth analysis, strategies, and actionable data.</li>
                <li>Online tools including niche validation, revenue estimation, and niche roulette.</li>
              </ul>
            </div>
          </section>

          {/* 2. Accounts & Registration */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">2. Accounts & Registration</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                To access certain features, you may need to create an account. You are responsible
                for maintaining the confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
              <p>
                You agree to provide accurate and complete information when creating your account and
                to update it as needed.
              </p>
            </div>
          </section>

          {/* 3. Subscriptions & Payments */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">3. Subscriptions & Payments</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                Niches Hunter offers free and paid subscription plans. Paid subscriptions are billed
                on a recurring basis (monthly or as indicated at the time of purchase).
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All payments are processed securely through{" "}
                  <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-[#00CC6A] hover:underline">
                    Stripe
                  </a>
                  .
                </li>
                <li>
                  Subscriptions automatically renew unless cancelled before the next billing date.
                </li>
                <li>
                  You can cancel your subscription at any time from your account page. Cancellation
                  takes effect at the end of the current billing period.
                </li>
                <li>
                  We do not offer refunds for partial billing periods. If you cancel mid-cycle, you
                  will retain access until the end of your current period.
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Acceptable Use */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">4. Acceptable Use</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Redistribute, resell, or share Pro content (newsletters, analyses, strategies)
                  with non-subscribers.
                </li>
                <li>
                  Use automated tools to scrape, copy, or extract data from our website or emails.
                </li>
                <li>
                  Attempt to gain unauthorized access to our systems or other users&apos; accounts.
                </li>
                <li>
                  Use the service for any illegal or unauthorized purpose.
                </li>
              </ul>
              <p>
                Violation of these terms may result in immediate suspension or termination of your
                account without refund.
              </p>
            </div>
          </section>

          {/* 5. Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">5. Intellectual Property</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                All content provided through Niches Hunter, including but not limited to newsletter
                content, niche analyses, strategies, website design, and branding, is the property of
                Niches Hunter and is protected by intellectual property laws.
              </p>
              <p>
                You are granted a personal, non-transferable, non-exclusive license to use the
                content for your own personal or business use. You may not reproduce, distribute, or
                publicly share our content without prior written permission.
              </p>
            </div>
          </section>

          {/* 6. Disclaimer */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">6. Disclaimer</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                The information provided by Niches Hunter is for informational purposes only. We do
                our best to provide accurate and up-to-date data, but we make no guarantees regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The accuracy or completeness of App Store data and rankings.</li>
                <li>The profitability or success of any niche or app idea.</li>
                <li>Revenue estimates, which are approximations based on available data.</li>
              </ul>
              <p>
                Niches Hunter is a research tool. Any business decisions you make based on our data
                are entirely your own responsibility.
              </p>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">7. Limitation of Liability</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                To the maximum extent permitted by law, Niches Hunter shall not be liable for any
                indirect, incidental, special, or consequential damages arising from your use of the
                service, including but not limited to loss of profits, data, or business
                opportunities.
              </p>
              <p>
                Our total liability for any claim related to the service shall not exceed the amount
                you paid us in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* 8. Service Availability */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">8. Service Availability</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We strive to keep Niches Hunter available at all times, but we do not guarantee
                uninterrupted access. The service may be temporarily unavailable due to maintenance,
                updates, or circumstances beyond our control.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the service at
                any time with reasonable notice.
              </p>
            </div>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">9. Termination</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We reserve the right to suspend or terminate your account at our discretion if you
                violate these Terms of Service. You may also delete your account at any time by
                contacting us.
              </p>
              <p>
                Upon termination, your right to access paid content ceases immediately. Sections
                regarding intellectual property, disclaimers, and limitation of liability survive
                termination.
              </p>
            </div>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">10. Changes to These Terms</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                We may update these Terms of Service from time to time. We will notify you of
                significant changes by updating the &quot;Last updated&quot; date at the top of this
                page. Continued use of the service after changes constitutes acceptance of the
                revised terms.
              </p>
            </div>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">11. Governing Law</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of
                France. Any disputes arising from these terms shall be subject to the exclusive
                jurisdiction of the courts of France.
              </p>
            </div>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">12. Contact Us</h2>
            <div className="space-y-4 text-[rgba(255,255,255,0.6)] leading-relaxed">
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
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
