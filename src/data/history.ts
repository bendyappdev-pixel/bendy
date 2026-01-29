export interface HistoryEra {
  id: string;
  period: string;
  title: string;
  years: string;
  description: string;
  highlights: string[];
  icon: string;
}

export const historyEras: HistoryEra[] = [
  {
    id: 'native',
    period: 'Pre-1855',
    title: 'Indigenous Peoples',
    years: 'Thousands of Years',
    description:
      'Long before European settlers arrived, the land that would become Bend was home to Indigenous peoples. The Paiute, Warm Springs, and Wasco tribes thrived in Central Oregon for thousands of years, drawing sustenance and spiritual nourishment from the Deschutes River and surrounding high desert landscapes.',
    highlights: [
      'The Deschutes River provided salmon and served as a spiritual landmark',
      'Tribes relied on game, roots, berries, and salmon plentiful in the area',
      'The river was central to ceremonies, stories, and traditions passed through generations',
      'In 1855, treaties established the Warm Springs Reservation where tribal members reside today',
    ],
    icon: 'Sunrise',
  },
  {
    id: 'exploration',
    period: '1820s-1870s',
    title: 'Exploration & Early Settlement',
    years: '1820s - 1877',
    description:
      'The first non-native visitors were fur trappers in the 1820s who explored the region. Government scouts like John C. Frémont surveyed Central Oregon in the 1840s and 1850s, but permanent settlement didn\'t begin until the 1870s.',
    highlights: [
      '1820s: Fur trappers first explore Central Oregon',
      '1840s-1850s: Army survey parties map the region',
      '1877: John Y. Todd establishes "Farewell Bend" Ranch along the Deschutes River',
      '1886: Post office opens under the shortened name "Bend"',
    ],
    icon: 'Compass',
  },
  {
    id: 'founding',
    period: '1900-1915',
    title: 'City Founding',
    years: '1900 - 1915',
    description:
      'Pioneer Alexander M. Drake arrived in 1900 with grand visions. He formed the Pilot Butte Development Company and established the town\'s street grid, first sawmill, canal system, and electrical infrastructure. The railroad arrived in 1911, connecting Bend to the wider world.',
    highlights: [
      '1900: Alexander Drake arrives and begins developing the town',
      '1901: First commercial sawmill established',
      '1904: Residents vote to become a city, shortening name to "Bend"',
      '1905: Bend officially incorporates with approximately 500 residents',
      '1911: Oregon Trunk Line Railroad reaches Bend',
    ],
    icon: 'Building',
  },
  {
    id: 'lumber',
    period: '1916-1950',
    title: 'The Lumber Boom',
    years: '1916 - 1950',
    description:
      'Two massive lumber mills—Brooks-Scanlon and Shevlin-Hixon—opened in 1916, sparking a timber boom that transformed Bend. At their peak, these were among the largest pine sawmills in the world, running around the clock and employing over 2,000 workers each.',
    highlights: [
      '1916: Brooks-Scanlon and Shevlin-Hixon mills begin operations',
      'Mills produced 10 billion board feet of lumber from 1916-1950',
      'Scandinavian, Slavic, Italian, and Greek immigrants arrived to work',
      'By the mid-1920s, combined capacity was among the largest in the world',
      '1950: Shevlin-Hixon closes; sells interests to Brooks-Scanlon',
    ],
    icon: 'TreePine',
  },
  {
    id: 'transition',
    period: '1950-1990',
    title: 'Recreation Emerges',
    years: '1950 - 1990',
    description:
      'As timber resources declined, Bend began its transformation from lumber town to outdoor recreation destination. Mt. Bachelor opened, the High Desert Museum was founded, and locals began to recognize the area\'s potential for tourism and outdoor sports.',
    highlights: [
      '1958: Mt. Bachelor opens with a rope tow and single lift',
      '1982: High Desert Museum founded',
      '1983: Brooks-Scanlon Mill A closes',
      'Mountain biking and outdoor recreation culture begins to flourish',
      'Historic buildings like the Tower Theatre (built 1940) become community landmarks',
    ],
    icon: 'Mountain',
  },
  {
    id: 'modern',
    period: '1990-Present',
    title: 'Modern Bend',
    years: '1990 - Today',
    description:
      'Bend has transformed into one of America\'s premier outdoor towns. The Old Mill District rose from the former lumber yards, craft breweries proliferated, and the population boomed as people discovered the unique combination of sunshine, outdoor access, and quality of life.',
    highlights: [
      'Old Mill District transforms former lumber yards into shopping and dining destination',
      '1997-2004: Tower Theatre undergoes major restoration',
      'Craft beer scene explodes with 30+ breweries',
      'Population grows from 20,000 (1990) to over 100,000 today',
      'Named one of the best outdoor towns in America by numerous publications',
    ],
    icon: 'Sparkles',
  },
];

export const historySources = [
  {
    name: 'Visit Bend - History & Heritage',
    url: 'https://visitbend.com/journal/history-heritage-of-bend-oregon/',
  },
  {
    name: 'Oregon Discovery - Bend History',
    url: 'https://oregondiscovery.com/bend-history',
  },
  {
    name: 'Old Mill District - History',
    url: 'https://www.oldmilldistrict.com/about/history/',
  },
  {
    name: 'Oregon History Project',
    url: 'https://www.oregonhistoryproject.org/narratives/central-oregon-adaptation-and-compromise-in-an-arid-landscape/',
  },
];
