/* =============================================================================
 * NOT REVIEWED BY A LAWYER.
 *
 * Sections 4, 5, 6, 9, 10 and 12 were drafted in August 2026 by a non-lawyer to
 * close specific, identified gaps:
 *
 *   - s.5  right to cancel + express-consent-to-immediate-performance waiver
 *          (Consumer Contracts (Information, Cancellation and Additional
 *          Charges) Regulations 2013, regs 28 and 37; EU Consumer Rights
 *          Directive art. 16(m)). There was no withdrawal clause at all.
 *   - s.4  the four ways coins come back, and the fact that a service-side
 *          refund is COINS, never money. The old text described only user
 *          cancellation, which is one of four paths, and never said what a
 *          refund consists of — the most likely source of a chargeback fight.
 *   - s.6  balance forfeiture on termination, previously unqualified.
 *   - s.9  warranty disclaimer, previously with no saver for statutory rights.
 *   - s.12 unilateral variation, previously with no notice period and no exit.
 *
 * All of it needs review by counsel qualified in England and Wales before it is
 * relied on. Placeholders elsewhere (registered number, registered office in
 * lib/site.ts) are also outstanding.
 * ========================================================================== */

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
    <LegalShell label="Legal" title="Terms of Service" updated="22 August 2026">
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
          <li>
            Coins are one-time in-app purchases processed by the Apple App
            Store under its payment terms. There is no subscription and nothing
            auto-renews.
          </li>
          <li>
            Coins are spent per activation. The amount depends on the service
            and the country, is driven mainly by the service, and is shown to
            you before you confirm.
          </li>
          <li>Coins do not expire, are not transferable, and have no cash value.</li>
        </ul>
        <p>
          <strong className="font-normal text-ink">
            When coins come back to you.
          </strong>{" "}
          Coins are returned to your balance automatically in four situations:
        </p>
        <ul>
          <li>you cancel an activation before a verification code has been received;</li>
          <li>you swap to a different number before a code has been received;</li>
          <li>the activation window ends without a code arriving; or</li>
          <li>our provider fails to supply a usable number for the activation.</li>
        </ul>
        <p>
          <strong className="font-normal text-ink">
            A return of coins is not a refund of money.
          </strong>{" "}
          In every situation above, what returns to you is the coins, credited
          back to your in-app balance. We do not return money for them, and
          coins have no cash value. If you want money back for a purchase, that
          is a matter for Apple: refunds of the purchase price are requested
          from and decided by Apple under the App Store refund policy, and we
          have no ability to issue, approve or refuse one. Section 5 sets out
          your separate statutory right to cancel.
        </p>
      </LegalSection>

      <LegalSection title="5. Your right to cancel (consumers in the UK and EU)">
        <p>
          If you are a consumer in the United Kingdom or the European Union, you
          normally have 14 days from the day a contract for digital content is
          concluded in which to cancel it and receive a refund, without giving a
          reason. This right comes from the Consumer Contracts (Information,
          Cancellation and Additional Charges) Regulations 2013 in the UK and
          from the Consumer Rights Directive in the EU.
        </p>
        <p>
          <strong className="font-normal text-ink">
            The exception that applies here, and what you are agreeing to.
          </strong>{" "}
          Coins are digital content that is supplied to your balance
          immediately, so that you can use them at once. By tapping to complete
          a purchase you (a) expressly request that we begin supplying the
          coins immediately, before the 14-day cancellation period has ended,
          and (b) acknowledge that once they have been credited to your balance
          you lose the right to cancel that purchase. You are shown this before
          you confirm, and you do not have to buy coins to install or open the
          App.
        </p>
        <p>
          <strong className="font-normal text-ink">
            If you have not used them.
          </strong>{" "}
          Where a pack you bought within the last 14 days is wholly unspent, we
          will support a refund request rather than stand on the waiver — write
          to us and we will confirm to Apple that the coins are unused and have
          been removed from your balance. The refund itself is Apple&rsquo;s to
          make, so the decision is theirs and not ours.
        </p>
        <p>
          Nothing in this section affects your other statutory rights, including
          your rights if the service is faulty, not as described, or not
          supplied with reasonable care and skill.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>You agree not to use the App to:</p>
        <ul>
          <li>break any law or regulation, or infringe anyone&rsquo;s rights;</li>
          <li>commit fraud, spam, harassment or identity misrepresentation;</li>
          <li>violate the terms of service of the platforms you sign up for — you are solely responsible for complying with them;</li>
          <li>receive communications you are required by law to receive on a verified personal number (for example, government, banking or emergency services where prohibited);</li>
          <li>resell, scrape or programmatically abuse the service.</li>
        </ul>
        <p>
          We may suspend or terminate an account that violates this section. In
          serious cases — fraud, or deliberate abuse of the refund or activation
          mechanics — we may also forfeit coins remaining on the balance, to the
          extent that doing so is proportionate to the breach. We will not
          forfeit a balance for a minor or one-off breach, and nothing here
          removes rights you have as a consumer that cannot be excluded by
          contract.
        </p>
      </LegalSection>

      <LegalSection title="7. Virtual numbers">
        <p>
          Virtual numbers are temporary and may be reissued to other users
          after your activation ends. They are intended for receiving one-time
          verification codes, not for ongoing personal or business use, account
          recovery, or two-factor authentication you rely on long-term.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual property">
        <p>
          The App, the Site and all related branding are owned by SIMNETIQ LTD
          or its licensors. We grant you a personal, non-exclusive,
          non-transferable licence to use the App for its intended purpose.
          Third-party service names shown in the App belong to their respective
          owners and do not imply endorsement.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimers">
        <p>
          The App is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;. To the fullest extent permitted by law we disclaim
          all warranties, express or implied, including fitness for a
          particular purpose. We do not warrant that any particular
          verification code will arrive, that numbers will be accepted by a
          given platform, or that the service will be uninterrupted or
          error-free.
        </p>
        <p>
          This section does not exclude or limit anything that cannot lawfully
          be excluded or limited. If you are a consumer, your statutory rights
          are unaffected — including your right under the Consumer Rights Act
          2015 (or its equivalent where you live) to a digital service supplied
          with reasonable care and skill, of satisfactory quality, and as
          described.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of liability">
        <p>
          Nothing in these Terms limits liability that cannot be limited by
          law, including for death, personal injury caused by negligence, or
          fraud. Otherwise, our total liability arising out of or in connection
          with the App is limited to the amount you paid us in the 12 months
          before the claim, and we are not liable for indirect or
          consequential losses, loss of profits, data or goodwill.
        </p>
      </LegalSection>

      <LegalSection title="11. Termination">
        <p>
          You can stop using the App and delete your account at any time. We
          may suspend or terminate access immediately if you breach these
          Terms, if a provider withdraws capability we depend on, or if we
          discontinue the service; where the law requires, we will give
          reasonable notice.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to these Terms">
        <p>
          We may update these Terms from time to time — for example when the
          law changes, when a provider we depend on changes, or when the App
          gains or loses a feature. Changes that materially affect your rights
          will be announced in the App or on the Site at least 30 days before
          they take effect. If you do not accept them, you may stop using the
          App and close your account before that date; write to us about any
          unspent coins and we will deal with your request in good faith.
          Continuing to use the App after the changes take effect means you
          accept the updated Terms. Changes never apply retrospectively to a
          purchase you have already made.
        </p>
      </LegalSection>

      <LegalSection title="13. Governing law">
        <p>
          These Terms are governed by the laws of England and Wales, and the
          courts of England and Wales have exclusive jurisdiction — except that
          if you are a consumer, you keep any mandatory protections and venue
          rights of the country where you live.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
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
