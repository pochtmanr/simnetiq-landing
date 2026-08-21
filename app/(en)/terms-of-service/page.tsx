import type { Metadata } from "next";
import { LegalShell, LegalSection } from "../../../components/Legal";
import { SUPPORT_EMAIL } from "../../../lib/site";
import { languageAlternates } from "../../../lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the SMS Code app and simnetiq.xyz, operated by SIMNETIQ LTD.",
  alternates: {
    canonical: "/terms-of-service",
    languages: languageAlternates("/terms-of-service"),
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalShell label="Legal" title="Terms of Service" updated="6 July 2026">
      <LegalSection title="1. Agreement">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between
          you and SIMNETIQ LTD, a company registered in England and Wales
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;), and govern your use of the SMS
          Code mobile application (the &ldquo;App&rdquo;) and the website
          simnetiq.xyz (the &ldquo;Site&rdquo;). By installing or using the App
          you accept these Terms. If you do not agree, do not use the App.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          The App provides temporary virtual phone numbers for receiving SMS
          verification codes from supported online services. Numbers are
          supplied by third-party telephony providers; availability of a given
          service, country or number is not guaranteed and can change without
          notice.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>
          You must be at least 18 years old and legally able to enter into this
          agreement. You may use the App only in ways permitted by the laws
          that apply to you.
        </p>
      </LegalSection>

      <LegalSection title="4. Coins and purchases">
        <ul>
          <li>Coins are one-time in-app purchases processed by the Apple App Store under its payment terms.</li>
          <li>Coins are spent per activation. The amount depends on the service and country and is shown before you confirm. If an activation is cancelled before a code is received, the coins are returned to your balance.</li>
          <li>Coins do not expire, are not transferable, and have no cash value.</li>
          <li>Refunds are handled through the store you purchased from, under that store&rsquo;s refund policy.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>You agree not to use the App to:</p>
        <ul>
          <li>break any law or regulation, or infringe anyone&rsquo;s rights;</li>
          <li>commit fraud, spam, harassment or identity misrepresentation;</li>
          <li>violate the terms of service of the platforms you sign up for — you are solely responsible for complying with them;</li>
          <li>receive communications you are required by law to receive on a verified personal number (for example, government, banking or emergency services where prohibited);</li>
          <li>resell, scrape or programmatically abuse the service.</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate this section
          without refund of remaining coins.
        </p>
      </LegalSection>

      <LegalSection title="6. Virtual numbers">
        <p>
          Virtual numbers are temporary and may be reissued to other users
          after your activation ends. They are intended for receiving one-time
          verification codes, not for ongoing personal or business use, account
          recovery, or two-factor authentication you rely on long-term.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          The App, the Site and all related branding are owned by SIMNETIQ LTD
          or its licensors. We grant you a personal, non-exclusive,
          non-transferable licence to use the App for its intended purpose.
          Third-party service names shown in the App belong to their respective
          owners and do not imply endorsement.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          The App is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;. To the fullest extent permitted by law we disclaim
          all warranties, express or implied, including fitness for a
          particular purpose. We do not warrant that any particular
          verification code will arrive, that numbers will be accepted by a
          given platform, or that the service will be uninterrupted or
          error-free.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          Nothing in these Terms limits liability that cannot be limited by
          law, including for death, personal injury caused by negligence, or
          fraud. Otherwise, our total liability arising out of or in connection
          with the App is limited to the amount you paid us in the 12 months
          before the claim, and we are not liable for indirect or
          consequential losses, loss of profits, data or goodwill.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          You can stop using the App and delete your account at any time. We
          may suspend or terminate access immediately if you breach these
          Terms, if a provider withdraws capability we depend on, or if we
          discontinue the service; where the law requires, we will give
          reasonable notice.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes will be
          announced in the App or on the Site before they take effect.
          Continuing to use the App after changes take effect means you accept
          the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law">
        <p>
          These Terms are governed by the laws of England and Wales, and the
          courts of England and Wales have exclusive jurisdiction — except that
          if you are a consumer, you keep any mandatory protections and venue
          rights of the country where you live.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
