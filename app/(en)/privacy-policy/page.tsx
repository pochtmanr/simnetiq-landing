import type { Metadata } from "next";
import { LegalShell, LegalSection } from "../../../components/Legal";
import { SUPPORT_EMAIL } from "../../../lib/site";
import { languageAlternates } from "../../../lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SIMNETIQ LTD collects, uses and protects your data in the SMS Code app and on simnetiq.xyz.",
  alternates: {
    canonical: "/privacy-policy",
    languages: languageAlternates("/privacy-policy"),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell label="Legal" title="Privacy Policy" updated="22 August 2026">
      <LegalSection title="1. Who we are">
        <p>
          SMS Code (the &ldquo;App&rdquo;) and the website simnetiq.xyz (the
          &ldquo;Site&rdquo;) are operated by SIMNETIQ LTD (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;), a company registered in England
          and Wales. We act as the data controller for the personal data
          described in this policy. You can reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. What the App does">
        <p>
          The App provides temporary virtual phone numbers that can receive SMS
          verification codes, so you can sign up for online services without
          sharing your personal phone number.
        </p>
      </LegalSection>

      <LegalSection title="3. Data we collect">
        <ul>
          <li>
            <strong className="font-normal text-ink">Account data.</strong>{" "}
            An anonymous account identifier created when you first open the App,
            and your email address if you choose to provide it.
          </li>
          <li>
            <strong className="font-normal text-ink">Purchase data.</strong>{" "}
            Records of coin packs you buy. Payment itself is processed by
            the Apple App Store — we never see your card details.
          </li>
          <li>
            <strong className="font-normal text-ink">Activation data.</strong>{" "}
            The service, country, virtual number and the text of verification
            SMS messages received on that number, kept for the time needed to
            deliver the code to you and to resolve disputes.
          </li>
          <li>
            <strong className="font-normal text-ink">Device data.</strong>{" "}
            Two things, and only if they apply to you. If you allow
            notifications, the push token your device is issued, so we can tell
            you a code has arrived. And the two-letter region code your device
            reports (for example <em>GB</em>), sent with the country list so we
            can mark one country &ldquo;Recommended&rdquo; — this is a device
            setting, not your location, and no location permission is involved.
          </li>
          <li>
            <strong className="font-normal text-ink">Support data.</strong>{" "}
            When you contact support through the Site or by email, we collect
            your name, email address and the content of your message. Support
            requests submitted on the Site are stored in our database (hosted
            on Supabase) and processed through our email tooling in order to
            respond to you. We also store your browser&rsquo;s user-agent
            string and a salted one-way hash of your IP address, to block
            automated abuse of the form.
          </li>
          <li>
            <strong className="font-normal text-ink">Website analytics.</strong>{" "}
            The Site uses Vercel Web Analytics, which counts page views without
            cookies and without profiling you across other websites. The App
            contains no analytics, advertising or attribution SDK of any kind.
          </li>
        </ul>
        <p>
          What we deliberately do not collect: your own phone number, your
          contacts, your location, advertising identifiers, and any usage,
          crash or diagnostic telemetry from inside the App. There is no
          analytics or crash-reporting SDK in the App, so there is nothing of
          that kind to send. This matches the App Store privacy label for SMS
          Code.
        </p>
      </LegalSection>

      <LegalSection title="4. How we use your data">
        <ul>
          <li>To provide virtual numbers and deliver verification codes to you (performance of a contract).</li>
          <li>To maintain your coin balance and restore purchases across devices (performance of a contract).</li>
          <li>To answer support requests (legitimate interests / performance of a contract).</li>
          <li>To detect and prevent fraud, abuse and violations of our Terms of Service (legitimate interests).</li>
          <li>To keep the Site working and understand which pages people find useful, using aggregated, cookie-free website analytics (legitimate interests).</li>
        </ul>
        <p>We do not sell your personal data and we do not use it for third-party advertising.</p>
      </LegalSection>

      <LegalSection title="5. Sharing and processors">
        <p>
          We share data only with service providers who process it on our
          behalf. In practice that is:
        </p>
        <ul>
          <li>
            <strong className="font-normal text-ink">Supabase</strong> — the
            database and backend behind the App. It holds everything described
            in section 3 that is stored at all.
          </li>
          <li>
            <strong className="font-normal text-ink">Apple</strong> — processes
            every in-app purchase, and handles Sign in with Apple if you use
            it. We never see your payment details.
          </li>
          <li>
            <strong className="font-normal text-ink">RevenueCat</strong> —
            validates purchase receipts and tells our backend which coin pack
            you bought. It receives your account identifier, purchase data and
            basic device information.
          </li>
          <li>
            <strong className="font-normal text-ink">Expo</strong> — delivers
            push notifications and App updates. It receives your push token and
            the text of the notification.
          </li>
          <li>
            <strong className="font-normal text-ink">Vercel</strong> — hosts
            the Site and provides its analytics.
          </li>
          <li>
            <strong className="font-normal text-ink">Our email tooling</strong>{" "}
            — carries support correspondence.
          </li>
          <li>
            <strong className="font-normal text-ink">
              Our telephony provider
            </strong>{" "}
            — supplies the virtual numbers. It is sent only the service and
            country you asked for; it receives no identifier of yours at all,
            so it cannot connect a number to you.
          </li>
        </ul>
        <p>
          Each processor is bound by a data processing agreement. We do not sell
          your data and we share nothing with advertisers. We may also disclose
          data where required by law.
        </p>
      </LegalSection>

      <LegalSection title="6. International transfers">
        <p>
          Some providers are located outside the United Kingdom. Where data
          leaves the UK or the European Economic Area, we rely on adequacy
          decisions or standard contractual clauses to protect it.
        </p>
      </LegalSection>

      <LegalSection title="7. Retention">
        <ul>
          <li>
            <strong className="font-normal text-ink">
              Activation data — 90 days.
            </strong>{" "}
            The rented number and the text of any SMS received on it are erased
            90 days after the activation ends. What remains after that is a
            record with no number and no message text: the service, the
            country, the date, the outcome and the coins involved. We keep that
            because it is the accounting record for coins you spent, and the
            evidence we need if a payment is disputed.
          </li>
          <li>
            <strong className="font-normal text-ink">
              Account data — until you delete your account.
            </strong>{" "}
            Deleting your account removes your account identifier, your email
            address and your activation history (see section 9).
          </li>
          <li>
            <strong className="font-normal text-ink">
              Purchase records — as required by law.
            </strong>{" "}
            A pseudonymised financial record of each purchase — transaction
            reference, pack, amount, date, and whether it was later refunded —
            is retained for the period tax and accounting law requires, and
            survives account deletion. It contains no phone number, no message
            text and no email address.
          </li>
          <li>
            <strong className="font-normal text-ink">
              Support correspondence — up to 24 months
            </strong>{" "}
            after the request is closed.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Under the UK GDPR and the EU GDPR you have the right to access,
          correct, delete or receive a copy of your personal data, to restrict
          or object to its processing, and to withdraw consent at any time
          where processing is based on consent. To exercise any of these
          rights, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link">
            {SUPPORT_EMAIL}
          </a>
          . You can also complain to the UK Information Commissioner&rsquo;s
          Office (ico.org.uk) or your local supervisory authority.
        </p>
      </LegalSection>

      <LegalSection title="9. Account and data deletion">
        <p>
          You can delete your account directly in the App (Settings &rarr;
          Delete account) or by emailing us. Deletion removes your account
          identifier, your email address, your coin balance and your activation
          history, including every rented number and every SMS body still held.
          It does not require contacting support and it is not reversible. The
          one thing it does not remove is the pseudonymised purchase record
          described in section 7, which we are required to keep and which
          cannot be traced back to you from the App.
        </p>
      </LegalSection>

      <LegalSection title="10. Children">
        <p>
          The App is not directed at children and is intended for users aged 18
          or over. We do not knowingly collect data from children; if you
          believe a child has used the App, contact us and we will delete the
          data.
        </p>
      </LegalSection>

      <LegalSection title="11. Security">
        <p>
          Data is encrypted in transit, access is restricted to personnel who
          need it, and our databases enforce row-level access controls. No
          system is perfectly secure, so we also keep the amount of data we
          hold to a minimum.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be
          announced in the App or on the Site, and the &ldquo;Last
          updated&rdquo; date above always reflects the current version.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
