import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import ViewfinderMark from '../ui/ViewfinderMark';

const credits: { role: string; name: string }[] = [
  { role: 'Directed by', name: 'The Locals' },
  { role: 'Director of Photography', name: 'Edwards, Benjamin' },
  { role: 'Production', name: 'Autom8 Media' },
  { role: 'A division of', name: 'Edwards Creative Co.' },
  { role: 'Filmed in', name: 'Bend, Oregon' },
  { role: 'Coordinates', name: '44.0582° N · 121.3153° W' },
];

const sections = [
  { name: 'Conditions', href: '/conditions' },
  { name: 'Trails', href: '/trails' },
  { name: 'Guides', href: '/guides' },
  { name: 'Camping', href: '/camping' },
];

const calendar = [
  { name: 'Events', href: '/events' },
  { name: 'Map', href: '/map' },
  { name: 'Food & Drink', href: '/category/food' },
  { name: 'Bendy Kids', href: '/category/family' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <footer className="mt-auto bg-black">
      <div className="container-app py-20">
        {/* Newsletter + production credits */}
        <div className="grid grid-cols-12 gap-6 border-b border-hair pb-16 lg:gap-10">
          <div className="col-span-12 md:col-span-6">
            <div className="small-caps text-ember">The Field Bulletin</div>
            <h2 className="film-display mt-3 text-[clamp(40px,5vw,72px)] leading-[0.9]">
              A Sunday Dispatch
              <br />
              From Bend.
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-mist">
              One email a week. The conditions, the events, the photo of the week. Sundays at
              6am. No noise.
            </p>

            {submitted ? (
              <p className="mt-6 font-mono text-[13px] text-ember" role="status">
                Subscribed. First dispatch lands Sunday at 6am.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email"
                  className="flex-1 border border-white/20 bg-transparent px-4 py-3 font-mono text-[13px] placeholder:text-whisper focus:border-ember focus:outline-none"
                />
                <button
                  type="submit"
                  className="small-caps whitespace-nowrap bg-ember px-6 py-3 text-film-black transition-colors hover:bg-flame"
                >
                  Subscribe ▶
                </button>
              </form>
            )}
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="small-caps text-whisper">Production Credits</div>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-[12px]">
              {credits.map((c) => (
                <div key={c.role}>
                  <dt className="text-whisper">{c.role}</dt>
                  <dd className="mt-0.5 text-film-white">{c.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Nav columns */}
        <div className="mt-12 grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-5">
            {/* text-film-white is explicit — the base stylesheet colours
                every <a> ember, which the wordmark would otherwise inherit. */}
            <Link to="/" className="flex items-center gap-3 text-film-white">
              <ViewfinderMark className="h-7 w-7" />
              <span className="film-display text-[44px] tracking-tight">BENDY</span>
            </Link>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-mist">
              A field guide to Central Oregon, shot and written by people who actually live
              here. Reel №07 · Spring 2026.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h3 className="small-caps mb-4 text-whisper">Sections</h3>
            <ul className="film-display-thin space-y-2 text-[20px]">
              {sections.map((s) => (
                <li key={s.href}>
                  <Link to={s.href} className="text-film-white hover:text-ember">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h3 className="small-caps mb-4 text-whisper">Calendar</h3>
            <ul className="film-display-thin space-y-2 text-[20px]">
              {calendar.map((s) => (
                <li key={s.href}>
                  <Link to={s.href} className="text-film-white hover:text-ember">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <h3 className="small-caps mb-4 text-whisper">Studio</h3>
            <a
              href="https://www.benjaminedwardsphotography.com"
              target="_blank"
              rel="noopener noreferrer"
              className="film-display-thin inline-block text-[22px] leading-tight text-film-white hover:text-ember"
            >
              Benjamin Edwards Photography
            </a>
            <p className="mt-3 font-mono text-[11px] text-whisper">
              Cinematography · Stills · Aerial
            </p>
          </div>
        </div>

        {/* Card-out */}
        <div className="mt-12 grid grid-cols-12 items-center gap-3 border-t border-hair pt-6 font-mono text-[11px] text-whisper">
          <div className="col-span-12 md:col-span-4">
            © {new Date().getFullYear()} Bendy · Not affiliated with the City of Bend.
          </div>
          <div className="col-span-12 md:col-span-4 md:text-center">
            Reel №07 · Spring 2026 · v2.0
          </div>
          <div className="col-span-12 text-ember md:col-span-4 md:text-right">FIN ·</div>
        </div>
      </div>
    </footer>
  );
}
