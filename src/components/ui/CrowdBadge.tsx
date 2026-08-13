/**
 * CrowdBadge — the single source of truth for how busy-ness is coloured and
 * worded, replacing the ad-hoc colouring that lived in three separate places.
 *
 * Review feedback on the old design was that raw EMPTY / MODERATE / PACKED
 * coding wasn't intuitive to first-time visitors, so every surface now shows
 * plain language ("Quiet · go now") rather than the enum value.
 *
 * Note on the mapping: the product models four levels (empty / moderate /
 * busy / packed) while the palette carries three crowd tokens. `busy` and
 * `packed` therefore share the `--crowd-packed` swatch and are told apart by
 * wording ("Busy · filling up" vs "Crowded · lot full"). Camping's separate
 * CrowdingLevel (High / Moderate / Low) folds into the same three tokens.
 */

import { CrowdLevel } from '../../types';
import { CrowdingLevel } from '../../types/camping';
import { cn } from '../../lib/utils';

export interface CrowdMeta {
  /** Short plain-language status, e.g. "Quiet". */
  label: string;
  /** Status plus its qualifier, e.g. "Quiet · go now". Used on map pins. */
  full: string;
  /** CSS custom property holding this level's token colour. */
  color: string;
}

const CROWD_META: Record<CrowdLevel, CrowdMeta> = {
  empty: { label: 'Quiet', full: 'Quiet · go now', color: 'var(--crowd-empty)' },
  moderate: { label: 'Some people', full: 'Some people', color: 'var(--crowd-mod)' },
  busy: { label: 'Busy', full: 'Busy · filling up', color: 'var(--crowd-packed)' },
  packed: { label: 'Crowded', full: 'Crowded · lot full', color: 'var(--crowd-packed)' },
};

/** Camping's High/Moderate/Low scale, folded onto the same three tokens. */
const CAMPING_TO_CROWD: Record<CrowdingLevel, CrowdLevel> = {
  Low: 'empty',
  Moderate: 'moderate',
  High: 'packed',
};

export function crowdMeta(level: CrowdLevel): CrowdMeta {
  return CROWD_META[level] ?? CROWD_META.moderate;
}

export function crowdMetaForCamping(level: CrowdingLevel): CrowdMeta {
  return crowdMeta(CAMPING_TO_CROWD[level] ?? 'moderate');
}

export interface CrowdBadgeProps {
  level: CrowdLevel;
  /** Show the qualifier too ("Quiet · go now") rather than just "Quiet". */
  verbose?: boolean;
  /** Render the glowing status dot. */
  dot?: boolean;
  className?: string;
}

export default function CrowdBadge({
  level,
  verbose = false,
  dot = true,
  className,
}: CrowdBadgeProps) {
  const meta = crowdMeta(level);

  return (
    <span className={cn('inline-flex items-center gap-2 font-mono text-[11px]', className)}>
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
        />
      )}
      <span style={{ color: meta.color }}>{verbose ? meta.full : meta.label}</span>
    </span>
  );
}

/** The shared legend, used above the map and anywhere levels need decoding. */
export function CrowdLegend({ className }: { className?: string }) {
  const entries: { color: string; label: string }[] = [
    { color: 'var(--crowd-empty)', label: 'Quiet' },
    { color: 'var(--crowd-mod)', label: 'Some people' },
    { color: 'var(--crowd-packed)', label: 'Crowded' },
  ];

  return (
    <div className={cn('flex flex-wrap items-center gap-5 font-mono text-[10px]', className)}>
      {entries.map((e) => (
        <div key={e.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full"
            style={{ background: e.color }}
          />
          <span className="text-mist">{e.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full border-2"
          style={{ borderColor: 'var(--ember)' }}
        />
        <span className="text-mist">You</span>
      </div>
    </div>
  );
}
