/**
 * Privacy policy.
 *
 * Every claim in here is grounded in what the code actually does: anonymous
 * crowd reports in Firestore, one localStorage rate-limit key, no cookies or
 * analytics, and browser-side calls to the mapping/weather services listed.
 * If a data flow is added or removed, update this page in the same change.
 */

import type { ReactNode } from 'react';

const EFFECTIVE_DATE = 'August 18, 2026';
const CONTACT = 'info@benjaminedwardsphotography.com';

const services = [
  {
    name: 'Vercel',
    role: 'Hosts the site and runs our small server that fetches road and resort conditions.',
    policy: 'https://vercel.com/legal/privacy-policy',
  },
  {
    name: 'Google Firebase (Firestore)',
    role: 'Stores and serves crowd reports.',
    policy: 'https://policies.google.com/privacy',
  },
  {
    name: 'Mapbox',
    role: 'Serves map tiles when you open the map page.',
    policy: 'https://www.mapbox.com/legal/privacy',
  },
  {
    name: 'Open-Meteo',
    role: 'Provides weather and air-quality forecasts.',
    policy: 'https://open-meteo.com/en/terms',
  },
  {
    name: 'Google Pollen API',
    role: 'Provides pollen forecasts on the conditions page.',
    policy: 'https://policies.google.com/privacy',
  },
  {
    name: 'USGS Water Services',
    role: 'Provides river flow data. A U.S. government service.',
    policy: 'https://www.usgs.gov/privacy-policies',
  },
];

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

export default function PrivacyPage() {
  return (
    <div className="horizon border-b border-hair bg-black">
      <div className="container-app py-24">
        <div className="small-caps text-ember">The Fine Print · 01</div>
        <h1 className="film-display mt-3 text-[clamp(40px,7vw,110px)]">Privacy Policy.</h1>
        <p className="mt-4 font-mono text-[12px] text-whisper">Effective {EFFECTIVE_DATE}</p>

        <p className="serif-i mt-8 max-w-2xl text-[clamp(18px,2vw,24px)] leading-snug text-mist">
          The short version: Bendy has no accounts, no ad trackers, and no analytics. We
          don&rsquo;t know who you are, and we like it that way.
        </p>

        <Section title="Who runs this site">
          <p>
            Bendy (bebendy.com) is an independent guide to Bend, Oregon, operated by Edwards
            Creative Co. in Bend, Oregon. Questions about this policy or your data:{' '}
            <a href={`mailto:${CONTACT}`} className="text-film-white underline hover:text-ember">
              {CONTACT}
            </a>
            .
          </p>
        </Section>

        <Section title="What we collect">
          <p>
            <span className="text-film-white">Crowd reports.</span> If you submit a crowd
            report, we store the location, the crowd level you picked, an optional short
            comment, and the time. That&rsquo;s the whole record — no name, no account, no
            device identifier. Reports are public and shown to other visitors, so please
            don&rsquo;t put personal information in the comment field.
          </p>
          <p>
            <span className="text-film-white">Newsletter.</span> If you sign up for the Sunday
            dispatch, we collect your email address and use it only to send that email. Every
            issue includes an unsubscribe link, and unsubscribing removes your address.
          </p>
          <p>
            <span className="text-film-white">Server logs.</span> Like nearly every website,
            our hosting provider records standard request logs (IP address, browser type,
            pages requested) for security and debugging. We don&rsquo;t use them to identify
            or profile you.
          </p>
          <p>That&rsquo;s it. We never ask for your name, location, or anything else.</p>
        </Section>

        <Section title="What we put on your device">
          <p>
            No cookies. No analytics scripts. No advertising trackers. The site stores one
            small entry in your browser&rsquo;s local storage (
            <code className="font-mono text-[13px] text-film-white">
              bendy_crowd_report_limits
            </code>
            ) to limit how often crowd reports can be submitted. It never leaves your device,
            and clearing your browser data removes it.
          </p>
        </Section>

        <Section title="Services your browser talks to">
          <p>
            Some data on the site is fetched by your browser directly from the services that
            publish it. When that happens, those services receive your IP address and
            standard request details, the same as when you visit any website. We send them
            nothing else about you.
          </p>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.name}>
                <span className="text-film-white">{s.name}</span> — {s.role}{' '}
                <a
                  href={s.policy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-whisper underline hover:text-ember"
                >
                  Privacy &amp; terms
                </a>
              </li>
            ))}
          </ul>
          <p>
            Road conditions (ODOT TripCheck) and resort conditions (Mt. Bachelor, Hoodoo) are
            fetched by our server on your behalf, so those sites never see your browser at
            all.
          </p>
        </Section>

        <Section title="What we don't do">
          <p>
            We don&rsquo;t sell or rent your information. We don&rsquo;t run behavioral or
            targeted advertising — sponsor banners on Bendy are plain images we place
            ourselves, with no tracking attached. We don&rsquo;t share data with anyone except
            the service providers listed above, who process it only to run the site.
          </p>
        </Section>

        <Section title="How long things stick around">
          <p>
            Crowd reports rotate off the site four hours after they&rsquo;re posted; older
            reports remain in our database until we periodically clear them. Newsletter addresses are kept until you unsubscribe. Hosting logs
            are retained on our providers&rsquo; standard short schedules.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Depending on where you live (including the EU/UK under GDPR and California under
            CCPA), you may have rights to access, correct, or delete personal information.
            Since we hold almost nothing, this is usually quick: email{' '}
            <a href={`mailto:${CONTACT}`} className="text-film-white underline hover:text-ember">
              {CONTACT}
            </a>{' '}
            and we&rsquo;ll take care of it — including removing a crowd report comment or a
            newsletter address. We will never discriminate against you for exercising these
            rights.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Bendy is a general-audience site. We don&rsquo;t knowingly collect personal
            information from children under 13. If you believe a child has submitted personal
            information (for example, in a crowd report comment), email us and we&rsquo;ll
            remove it.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If our data practices change, we&rsquo;ll update this page and the effective date
            above. Meaningful changes will be noted in plain language at the top of this
            policy.
          </p>
        </Section>

        <div className="mt-16 border-t border-hair pt-6 font-mono text-[11px] text-whisper">
          BENDY · BEND, OR · <span className="text-ember">FIN ·</span>
        </div>
      </div>
    </div>
  );
}
