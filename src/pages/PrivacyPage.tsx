import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Lock, ArrowLeft } from 'lucide-react';

const LAST_UPDATED = 'August 19, 2026';

export const PrivacyPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-artiva-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Artiva
      </button>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6 text-artiva-teal" />
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Privacy Policy</h1>
        </div>
        <p className="text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-artiva text-xs text-amber-900 leading-relaxed">
        <strong>Draft, not legal advice.</strong> This policy describes what the app actually does in
        good faith, but it has not been reviewed by a lawyer qualified in Nigerian data protection law.
        Have qualified NDPA counsel review this before relying on it for a commercial launch.
      </div>

      <Card className="prose-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account details:</strong> name, phone number, email address, and registered estate.</li>
            <li><strong>Artisan verification data:</strong> identity documents (e.g. NIN slip, driver's license) and trade/skill information you submit for review.</li>
            <li><strong>Booking &amp; payment data:</strong> service requests, booking history, and escrow transaction records. Card and bank details are collected and processed directly by our payment processor, Paystack — Artiva never receives or stores your full card number.</li>
            <li><strong>Location data:</strong> if you grant permission, your device's approximate GPS location, used only to sort artisans by real distance. You can decline this and we'll estimate distance from your registered estate instead. An Artisan's service address, if they provide one during verification, is converted to map coordinates using OpenStreetMap's Nominatim geocoding service.</li>
            <li><strong>Device &amp; usage data:</strong> basic technical information such as browser type, stored locally to keep you signed in and remember your preferences.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">2. How We Use Your Information</h2>
          <p>We use the information above to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Match Residents with nearby, verified Artisans;</li>
            <li>Process bookings, escrow holds, and payouts;</li>
            <li>Review Artisan identity documents during verification;</li>
            <li>Investigate and resolve disputes between Residents and Artisans;</li>
            <li>Communicate booking updates, security codes, and account notices;</li>
            <li>Maintain estate security records for gate access passes tied to a booking.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">3. Who We Share Information With</h2>
          <p>
            We share information only as needed to run the service: with <strong>Paystack</strong> to
            process payments and escrow transactions; with <strong>Firebase/Google Cloud</strong>, our
            authentication and database provider, to sign you in and store your account and booking
            records; with <strong>OpenStreetMap's Nominatim service</strong>, to convert an Artisan's
            submitted address into map coordinates (only the address text is sent, not your name or
            phone number); with estate security personnel, limited to the gate access pass code and
            visit schedule for a specific booking; with the other party to a booking (a Resident and
            Artisan can see each other's name, phone number, and job details for that booking); and with
            law enforcement or regulators when required by Nigerian law. We do not sell your personal
            information to third parties.
          </p>
          <p>
            Some of these providers process data on servers located outside Nigeria. Where that happens,
            we rely on the provider's standard contractual and security safeguards for that transfer, as
            permitted under the Nigeria Data Protection Act.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">4. Data Retention</h2>
          <p>
            We retain account and booking records for as long as your account is active and for a
            reasonable period afterward to meet legal, dispute-resolution, and accounting obligations.
            Deleting your account (from your Profile page) removes your active session; associated
            booking and dispute records tied to other users' transaction history may be retained as
            required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">5. Our Legal Basis for Processing</h2>
          <p>
            We process your personal data because it's necessary to perform our contract with you (e.g.
            matching you with an Artisan, holding escrow, resolving a dispute), because you've consented
            (e.g. sharing your GPS location), or to comply with a legal obligation (e.g. retaining
            transaction records).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">6. Your Rights</h2>
          <p>
            Under the Nigeria Data Protection Act, 2023 (NDPA), you have the right to be informed about
            how your data is processed, to access a copy of it, to correct inaccurate data, to request
            deletion or restriction of processing, to object to or withdraw consent for processing, and
            to data portability. You can update your contact details anytime from your Profile page, or
            write to our Data Protection Officer at{' '}
            <a href="mailto:privacy@artiva.ng" className="text-artiva-teal font-semibold hover:underline">
              privacy@artiva.ng
            </a>{' '}
            to exercise these rights. If you believe we haven't handled your data properly, you also have
            the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">7. Security</h2>
          <p>
            We use industry-standard safeguards to protect your data, and rely on Paystack's
            PCI-DSS-compliant infrastructure for payment processing. No online service can guarantee
            perfect security, so please use a strong, unique password and keep your login details
            private.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">8. Children's Privacy</h2>
          <p>
            Artiva is not directed at children under 18, and we do not knowingly collect personal
            information from anyone under that age.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We'll update the "Last updated" date
            above whenever we do.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">10. Contact</h2>
          <p>
            Questions about this Privacy Policy can be sent to{' '}
            <a href="mailto:privacy@artiva.ng" className="text-artiva-teal font-semibold hover:underline">
              privacy@artiva.ng
            </a>.
          </p>
        </section>
      </Card>
    </div>
  );
};
