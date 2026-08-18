/**
 * Terms of service.
 *
 * The load-bearing sections for a conditions-and-trails site are the ones
 * about data accuracy and outdoor risk: Bendy republishes third-party and
 * visitor-reported conditions, and nobody should make a safety decision on
 * them. Keep those sections intact when editing.
 */

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const EFFECTIVE_DATE = 'August 18, 2026';
const CONTACT = 'info@benjaminedwardsphotography.com';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 border-t border-hair pt-8">
      <h2 className="film-display-thin text-[clamp(24px,3vw,34px)] text-film-white">{title}</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-relaxed text-mist">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="horizon border-b border-hair bg-black">
      <div className="container-app py-24">
        <div className="small-caps text-ember">The Fine Print · 02</div>
        <h1 className="film-display mt-3 text-[clamp(40px,7vw,110px)]">Terms of Service.</h1>
        <p className="mt-4 font-mono text-[12px] text-whisper">Effective {EFFECTIVE_DATE}</p>

        <p className="serif-i mt-8 max-w-2xl text-[clamp(18px,2vw,24px)] leading-snug text-mist">
          The short version: Bendy is a free guide, not a guarantee. Conditions change faster
          than websites do — check official sources, and be your own judge out there.
        </p>

        <Section title="The agreement">
          <p>
            These terms are a contract between you and Edwards Creative Co. (&ldquo;Bendy,&rdquo;
            &ldquo;we&rdquo;), the operator of bebendy.com. By using the site you agree to
            them; if you don&rsquo;t agree, don&rsquo;t use the site. If you&rsquo;re under
            18, use Bendy with a parent or guardian&rsquo;s involvement.
          </p>
        </Section>

        <Section title="What Bendy is (and isn't)">
          <p>
            Bendy is an independent, free guide to Bend, Oregon — trails, conditions, events,
            camping, food. We are not affiliated with or endorsed by the City of Bend, Visit
            Bend, the U.S. Forest Service, ODOT, Mt. Bachelor, Hoodoo, or any other agency,
            resort, or business we write about.
          </p>
        </Section>

        <Section title="Conditions data is best-effort">
          <p>
            Weather, snow, road, river, air-quality, and crowd information on Bendy is
            gathered automatically from third-party sources and from anonymous visitor
            reports. It can be wrong, stale, or incomplete, and we don&rsquo;t verify it.
          </p>
          <p>
            <span className="text-film-white">
              Never make a safety decision based on this site.
            </span>{' '}
            Before you go, check official sources: TripCheck for roads, the National Weather
            Service for weather, the resort for lift and snow status, and the local ranger
            district for trail and fire conditions.
          </p>
        </Section>

        <Section title="The outdoors is on you">
          <p>
            Hiking, climbing, skiing, paddling, caving, and everything else this guide covers
            carry real risks — weather, terrain, wildlife, and your own preparation. You
            assume those risks entirely. Bendy is a publication, not a guide service, and
            nothing on the site is professional, safety, or medical advice.
          </p>
        </Section>

        <Section title="Crowd reports and other submissions">
          <p>
            Crowd reports are anonymous and public. By submitting one you grant us a
            worldwide, royalty-free, perpetual license to store, reproduce, adapt, display,
            and share it in connection with Bendy. Keep reports honest and civil: no false
            reports, no personal information about yourself or anyone else, no unlawful,
            abusive, or promotional content, and no automated submissions. We may remove or
            refuse any report, and may suspend or block access to the site or its features at
            any time, with or without cause.
          </p>
        </Section>

        <Section title="Our content">
          <p>
            The writing, design, and much of the photography on Bendy belong to Edwards
            Creative Co. or their credited contributors. You&rsquo;re welcome to share links
            and use the site personally; don&rsquo;t republish, scrape, or resell its content
            wholesale without permission. If a photograph here is yours and uncredited, email{' '}
            <a href={`mailto:${CONTACT}`} className="text-film-white underline hover:text-ember">
              {CONTACT}
            </a>{' '}
            and we&rsquo;ll credit you properly or take it down — your choice.
          </p>
          <p>
            If you believe any content on Bendy infringes your copyright, email{' '}
            <a href={`mailto:${CONTACT}`} className="text-film-white underline hover:text-ember">
              {CONTACT}
            </a>{' '}
            with the work, where it appears on the site, and your contact information, and
            we&rsquo;ll respond promptly.
          </p>
        </Section>

        <Section title="Sponsors and links">
          <p>
            Bendy may display sponsor or partner banners; they&rsquo;re placed by us as plain
            images and identified as such. Links to other websites are provided for
            convenience — we don&rsquo;t control them and aren&rsquo;t responsible for their
            content or practices.
          </p>
        </Section>

        <Section title="No warranties">
          <p>
            Bendy is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
            warranties of any kind, express or implied — including accuracy, reliability,
            availability, or fitness for a particular purpose. The site may change, break, or
            go away at any time.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, Edwards Creative Co. and its contributors
            are not liable for any damages of any kind — direct, indirect, incidental,
            consequential, or special — arising from your use of the site or reliance on its
            information, including personal injury, property damage, or economic loss. Where
            liability can&rsquo;t be excluded, our total aggregate liability is limited to
            $50. Some jurisdictions don&rsquo;t allow certain exclusions, so
            parts of this section may not apply to you.
          </p>
        </Section>

        <Section title="If you cause a problem">
          <p>
            If your use of the site — including anything you submit — violates these terms or
            the law and results in a claim against us, you agree to indemnify Edwards
            Creative Co. for the resulting losses and reasonable legal costs.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms as the site evolves; the effective date above will
            change when we do, and continued use after an update means you accept the revised
            terms. We may also modify or discontinue any part of the site at any time.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of the State of Oregon, without regard to
            conflict-of-law rules. Any dispute will be resolved in the state or federal
            courts serving Deschutes County, Oregon. If any provision is found unenforceable,
            the rest remain in effect.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms:{' '}
            <a href={`mailto:${CONTACT}`} className="text-film-white underline hover:text-ember">
              {CONTACT}
            </a>
            . For how we handle data, see the{' '}
            <Link to="/privacy" className="text-film-white underline hover:text-ember">
              privacy policy
            </Link>
            .
          </p>
        </Section>

        <div className="mt-16 border-t border-hair pt-6 font-mono text-[11px] text-whisper">
          BENDY · BEND, OR · <span className="text-ember">FIN ·</span>
        </div>
      </div>
    </div>
  );
}
