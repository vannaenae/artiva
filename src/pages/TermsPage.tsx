import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { FileText, ArrowLeft } from 'lucide-react';

const LAST_UPDATED = 'August 17, 2026';

export const TermsPage: React.FC = () => {
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
          <FileText className="w-6 h-6 text-artiva-teal" />
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Terms of Service</h1>
        </div>
        <p className="text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
      </div>

      <Card className="prose-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms") govern your access to and use of Artiva, a marketplace
            connecting residents of participating Nigerian residential estates ("Residents") with
            independent home-service professionals ("Artisans"). By creating an account or using
            Artiva, you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">2. What Artiva Is — and Isn't</h2>
          <p>
            Artiva is a booking and escrow-payment platform. We help Residents find and pay Artisans,
            and we hold funds in escrow until a job is confirmed complete by both parties. Artisans are
            independent contractors, not employees or agents of Artiva. We do not perform the services
            listed on the platform, and we are not a party to the underlying service agreement between
            a Resident and an Artisan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">3. Accounts &amp; Eligibility</h2>
          <p>
            You must provide accurate registration information and keep it up to date. You are
            responsible for all activity under your account. You must be at least 18 years old and
            legally capable of entering into binding contracts under Nigerian law to use Artiva.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">4. Artisan Verification</h2>
          <p>
            Artisans on Artiva submit identity documentation (such as a NIN slip, voter's card, or
            driver's license) for review before receiving a "Verified" badge. Verification confirms
            identity and estate access clearance; it is not a guarantee of workmanship, and Artiva does
            not warrant the quality, safety, or legality of any Artisan's work beyond the protections
            described in Section 6.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">5. Bookings &amp; Payments</h2>
          <p>
            When a Resident books an Artisan, the quoted amount (a fixed rate or an on-site diagnosis
            fee) is charged and held in escrow via our payment processor, Paystack. Artiva does not
            store your card details — payment processing is handled entirely by Paystack under its own
            terms and PCI-compliant infrastructure. For on-site inspection bookings, the Artisan may
            submit a custom quote after diagnosing the job, which the Resident must approve (or reject)
            before further escrow funds are locked.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">6. Escrow Release, Disputes &amp; Warranty</h2>
          <p>
            Escrowed funds are released to the Artisan only after both the Artisan marks a job complete
            and the Resident confirms completion, or automatically 48 hours after the Artisan marks
            completion if the Resident raises no dispute. Either party may raise a dispute before
            release; disputed funds remain frozen until an Artiva administrator reviews both sides of
            the story and issues a resolution. Completed jobs carry a 7-day workmanship warranty during
            which the Resident may report defects for a free callback.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">7. Cancellations &amp; Refunds</h2>
          <p>
            A Resident may cancel a booking before an Artisan accepts it for a full refund of escrowed
            funds. Once accepted, cancellation and refund eligibility is handled through the dispute
            process described above.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">8. Acceptable Use</h2>
          <p>
            You agree not to: misrepresent your identity or credentials; use Artiva to arrange payment
            outside of escrow for a booking made on the platform; harass, threaten, or discriminate
            against other users; or attempt to circumvent our verification, security, or dispute
            processes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by Nigerian law, Artiva's liability for any claim arising
            from your use of the platform is limited to the amount held in escrow for the booking giving
            rise to the claim. Artiva is not liable for indirect, incidental, or consequential damages,
            or for the acts or omissions of independent Artisans or Residents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">10. Termination</h2>
          <p>
            We may suspend or terminate accounts that violate these Terms, submit fraudulent
            verification documents, or pose a risk to other users or estate security. You may delete
            your account at any time from your Profile page.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute not
            resolved through Artiva's internal dispute process is subject to the exclusive jurisdiction
            of the courts of Lagos State.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">12. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of Artiva after an update
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 font-heading">13. Contact</h2>
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:support@artiva.ng" className="text-artiva-teal font-semibold hover:underline">
              support@artiva.ng
            </a>.
          </p>
        </section>
      </Card>
    </div>
  );
};
