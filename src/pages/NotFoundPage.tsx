/**
 * 404.
 *
 * The router previously had no catch-all, so any unrecognised URL rendered
 * the header and footer around an empty <main> with no explanation and no way
 * back. Framed here as an end-of-reel slate.
 */

import { Link } from 'react-router-dom';

const elsewhere = [
  { name: 'Conditions', href: '/conditions' },
  { name: 'Trails', href: '/trails' },
  { name: 'Guides', href: '/guides' },
  { name: 'Camping', href: '/camping' },
  { name: 'Events', href: '/events' },
  { name: 'Map', href: '/map' },
];

export default function NotFoundPage() {
  return (
    <section className="horizon border-b border-hair bg-black">
      <div className="container-app py-24">
        <div className="small-caps text-ember">Reel break · 404</div>
        <h1 className="film-display mt-3 text-[clamp(40px,9vw,140px)]">
          Nothing On This Reel.
        </h1>
        <p className="serif-i mt-6 max-w-xl text-[clamp(18px,2vw,26px)] leading-snug text-mist">
          That page isn&rsquo;t in the can — it may have moved, or it may never have been
          shot.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link to="/" className="btn-primary">
            <span aria-hidden="true">▶</span>
            <span>Back to the top</span>
          </Link>
          <Link to="/map" className="btn-secondary">
            Open the map
          </Link>
        </div>

        <nav className="mt-16 border-t border-hair pt-8" aria-label="Sections">
          <div className="small-caps text-whisper">Try one of these</div>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-6">
            {elsewhere.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="film-display-thin text-[26px] text-film-white hover:text-ember"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-16 border-t border-hair pt-6 font-mono text-[11px] text-whisper">
          BEND, OR · 44.0582° N · 121.3153° W · <span className="text-ember">FIN ·</span>
        </div>
      </div>
    </section>
  );
}
