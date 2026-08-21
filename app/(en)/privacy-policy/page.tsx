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
    <LegalShell label="Legal" title="Privacy Policy" updated="6 July 2026">
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
            <strong className="font-normal text-ink">Device and usage data.</strong>{" "}
            Device model, operating system version, app version, language and
            crash or diagnostic logs.
          </li>
          <li>
            <strong className="font-normal text-ink">Support data.</strong>{" "}
            When you contact support through the Site or by email, we collect
            your name, email address and the content of your message. Support
            requests submitted on the Site are stored in our database (hosted
            on Supabase) and processed through our email tooling in order to
            respond to you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. How we use your data">
        <ul>
          <li>To provide virtual numbers and deliver verification codes to you (performance of a contract).</li>
          <li>To maintain your coin balance and restore purchases across devices (performance of a contract).</li>
          <li>To answer support requests (legitimate interests / performance of a contract).</li>
          <li>To detect and prevent fraud, abuse and violations of our Terms of Service (legitimate interests).</li>
          <li>To fix bugs and improve the App using aggregated diagnostics (legitimate interests).</li>
        </ul>
        <p>We do not sell your personal data and we do not use it for third-party advertising.</p>
      </LegalSection>

      <LegalSection title="5. Sharing and processors">
        <p>
          We share data only with service providers who process it on our
          behalf: cloud hosting and database providers, telephony providers
          that supply the virtual numbers, Apple for in-app purchases, and
          email delivery tooling for support correspondence.
          Each processor is bound by a data processing agreement. We may also
          disclose data where required by law.
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
        <p>
          Activation data, including received SMS text, is kept only as long as
          needed to operate the service and handle disputes, then deleted or
          anonymised. Account and purchase records are kept while your account
          is active and for the period required by tax and accounting law.
          Support correspondence is kept for up to 24 months after the request
          is closed.
        </p>
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
          identifier, activation history and any stored email address, except
          for records we must keep by law.
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
