import { Guide } from '../types/guide';

export const guides: Guide[] = [
  // Guide 1: The Photographer's Golden Hour Tour
  {
    id: 'photographers-golden-hour',
    slug: 'photographers-golden-hour-tour',
    title: "The Photographer's Golden Hour Tour",
    tagline: 'Perfect light, epic landscapes, and the best coffee stops in between',
    description:
      "Chase the light across Central Oregon's most photogenic locations. From the legendary reflections at Sparks Lake to the dramatic basalt formations of Smith Rock, this full-day adventure is designed to put you in the right place at the right time for unforgettable shots.",
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    duration: 'Full Day (10-12 hours)',
    difficulty: 'moderate',
    seasons: ['summer', 'fall'],
    bestFor: ['Photographers', 'Early risers', 'Landscape lovers'],
    seasonalNotes: [
      {
        seasons: ['winter', 'spring'],
        note: 'Sparks Lake and Cascade Lakes Highway are typically closed November through May. Consider alternative sunrise locations like Pilot Butte or Tumalo Falls.',
      },
      {
        seasons: ['summer'],
        note: 'Best conditions for Sparks Lake reflections. Arrive 45 minutes before sunrise for setup. Mosquitoes can be intense in July—bring repellent!',
      },
      {
        seasons: ['fall'],
        note: 'September offers excellent conditions with fewer crowds and beautiful fall colors at higher elevations. Check road conditions as closures can begin in October.',
      },
    ],
    stops: [
      {
        id: 'sparks-lake-sunrise',
        time: '5:30 AM',
        title: 'Sparks Lake Sunrise',
        location: 'Sparks Lake, Cascade Lakes Highway',
        description:
          'Arrive 45 minutes before sunrise to set up for the legendary reflections of South Sister and Broken Top. The calm morning waters create mirror-like conditions perfect for landscape photography.',
        tips: [
          'Park at the day-use area and walk to the northwest shore for classic compositions',
          'Bring a tripod—long exposures work beautifully here',
          'The best reflections occur before the wind picks up (usually by 8 AM)',
          'Northwest Forest Pass required for parking',
        ],
        duration: '2-3 hours',
        coordinates: [-121.7347, 44.0056],
      },
      {
        id: 'morning-coffee',
        time: '8:30 AM',
        title: 'Coffee & Breakfast Stop',
        location: 'Thump Coffee, Downtown Bend',
        description:
          'Fuel up with excellent coffee and breakfast after your early morning shoot. Thump is a local favorite with great pastries and a relaxed atmosphere perfect for reviewing your morning shots.',
        tips: [
          'Try their house-made pop tarts or breakfast burrito',
          'Free WiFi if you need to back up photos',
        ],
        duration: '45 minutes',
        alternatives: [
          {
            title: 'Sparrow Bakery',
            description: 'Famous for the "Ocean Roll" cardamom pastry. A bit busier but worth it.',
          },
        ],
      },
      {
        id: 'smith-rock',
        time: '10:00 AM',
        title: 'Smith Rock State Park',
        location: 'Smith Rock State Park, Terrebonne',
        description:
          'The dramatic basalt formations and Crooked River create endless photographic opportunities. Morning light illuminates the orange and red cliffs beautifully.',
        tips: [
          'Park at the main lot (day-use fee required) and take the Canyon Trail for classic views',
          'The Misery Ridge viewpoint offers stunning panoramas but requires a steep climb',
          'Bring a telephoto lens to capture climbers on the walls',
          'The river crossing may be challenging in spring—check conditions',
        ],
        duration: '2-3 hours',
        coordinates: [-121.1402, 44.3683],
      },
      {
        id: 'lunch-stop',
        time: '1:00 PM',
        title: 'Lunch Break',
        location: 'Terrebonne Depot, Terrebonne',
        description:
          'Grab lunch at this charming converted train depot, just minutes from Smith Rock. Great burgers, salads, and local beer on tap.',
        tips: [
          'Outdoor seating available with views toward Smith Rock',
          'Can get busy on weekends—call ahead if possible',
        ],
        duration: '1 hour',
        alternatives: [
          {
            title: 'Pack a Picnic',
            description:
              'Pick up supplies at Newport Market in Bend and enjoy lunch at one of the Smith Rock picnic areas.',
          },
        ],
      },
      {
        id: 'newberry-crater',
        time: '2:30 PM',
        title: 'Newberry Volcanic Monument',
        location: 'Newberry National Volcanic Monument',
        description:
          'Explore the stunning caldera featuring two alpine lakes, obsidian flows, and volcanic landscapes. Paulina Falls and the Big Obsidian Flow offer excellent photo opportunities.',
        tips: [
          'Stop at Paulina Falls first—afternoon light is beautiful on the cascades',
          'The Big Obsidian Flow trail is 0.9 miles and offers incredible textures for detail shots',
          'Paulina Lake viewpoint offers panoramic caldera views',
          'Northwest Forest Pass required; can be purchased at the entrance',
        ],
        duration: '2-3 hours',
        coordinates: [-121.2273, 43.7169],
      },
      {
        id: 'sunset-location',
        time: '6:30 PM',
        title: 'Sunset at Pilot Butte',
        location: 'Pilot Butte State Scenic Viewpoint, Bend',
        description:
          'End your day with 360-degree views over Bend and the Cascade peaks. The volcanic cinder cone offers easy access and spectacular sunset colors over the mountains.',
        tips: [
          'Drive up or hike the 1-mile trail to the summit',
          'West-facing views capture alpenglow on the Three Sisters',
          'Bring a wide-angle lens for panoramic shots',
          'Stays open until 10 PM in summer',
        ],
        duration: '1-2 hours',
        coordinates: [-121.2839, 44.0561],
        alternatives: [
          {
            title: 'Return to Sparks Lake',
            description:
              'If conditions are calm and you have the energy, sunset reflections at Sparks Lake can be even more spectacular than sunrise.',
          },
        ],
      },
    ],
    practicalInfo: {
      permits: [
        'Northwest Forest Pass required at Sparks Lake, Newberry Monument',
        'Oregon State Parks day-use fee at Smith Rock ($5 per vehicle)',
      ],
      parking: [
        'Sparks Lake: Large day-use lot, arrive early in summer',
        'Smith Rock: Main lot fills by 10 AM on weekends—overflow lot available',
        'Newberry: Multiple lots at each attraction',
      ],
      gear: [
        'Tripod (essential for sunrise/sunset)',
        'Polarizing filter (reduces glare on water)',
        'Wide-angle and telephoto lenses',
        'Extra batteries (cold mornings drain quickly)',
        'Headlamp for pre-dawn setup',
        'Layers—temperatures vary dramatically',
      ],
      budgetEstimate: '$20-30 for passes and fees, plus food',
    },
    seoTitle: "Photographer's Guide to Bend Oregon | Best Photo Locations & Golden Hour Spots",
    seoDescription:
      "Discover the best photography locations in Bend, Oregon. From Sparks Lake sunrise to Smith Rock, this local guide reveals perfect golden hour spots, timing tips, and insider knowledge.",
  },

  // Guide 2: The Ultimate Family Fun Day
  {
    id: 'family-fun-day',
    slug: 'ultimate-family-fun-day',
    title: 'The Ultimate Family Fun Day',
    tagline: 'Kid-approved adventures that parents will love too',
    description:
      "Create unforgettable family memories with this carefully crafted day of Central Oregon adventures. From easy river trails to fascinating museums, every stop is designed to keep kids engaged and parents happy.",
    heroImage: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1920&q=80',
    duration: 'Full Day (8-9 hours)',
    difficulty: 'easy',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    bestFor: ['Families with kids', 'All ages', 'Mixed interests'],
    seasonalNotes: [
      {
        seasons: ['winter'],
        note: 'Lava River Cave is closed November through April. The High Desert Museum is an excellent all-weather option year-round.',
      },
      {
        seasons: ['summer'],
        note: 'Start early to beat the heat. Bring plenty of water and sunscreen for outdoor activities.',
      },
      {
        seasons: ['spring', 'fall'],
        note: 'Perfect temperatures for outdoor exploration. Some trails may be muddy in spring.',
      },
    ],
    stops: [
      {
        id: 'breakfast',
        time: '8:30 AM',
        title: 'Breakfast at McKay Cottage',
        location: 'McKay Cottage Restaurant, Bend',
        description:
          "Start your adventure at this beloved Bend institution. The converted 1916 cottage offers a cozy atmosphere and a kids' menu that actually has good food.",
        tips: [
          'Expect a wait on weekends—put your name in and explore the garden',
          "Kids love the pancakes and the outdoor seating area",
          'Gluten-free and vegetarian options available',
        ],
        duration: '1 hour',
        alternatives: [
          {
            title: "Victorian Café",
            description: 'Another family-friendly breakfast spot with generous portions and a fun atmosphere.',
          },
        ],
      },
      {
        id: 'river-trail',
        time: '9:45 AM',
        title: 'Deschutes River Trail Walk',
        location: 'Deschutes River Trail, various access points',
        description:
          "An easy, scenic walk along the river with plenty of spots to stop and explore. The paved sections are stroller-friendly, and kids love watching for ducks, fish, and the occasional otter.",
        tips: [
          'Start at the First Street Rapids Park for easy parking and restrooms',
          'Walk south toward the Old Mill District (about 1 mile)',
          'Bring bread for the ducks (actually, better to skip this—wild bird seed is healthier)',
          'Benches along the way for rest stops',
        ],
        duration: '1-1.5 hours',
      },
      {
        id: 'lunch',
        time: '11:30 AM',
        title: 'Lunch at 10 Barrel Brewing',
        location: '10 Barrel Brewing, East Bend',
        description:
          "Yes, it's a brewery, but this one is genuinely family-friendly with a great kids' menu, large outdoor area, and lawn games. Parents can enjoy a craft beer while kids play.",
        tips: [
          'Large outdoor patio with lawn games and fire pits',
          "Kids' menu includes mac & cheese, grilled cheese, and chicken tenders",
          'Root beer floats are a hit with the younger crowd',
        ],
        duration: '1 hour',
        alternatives: [
          {
            title: 'Flatbread Community Oven',
            description: 'Wood-fired pizzas that kids love, plus a casual atmosphere.',
          },
        ],
      },
      {
        id: 'afternoon-activity',
        time: '1:00 PM',
        title: 'High Desert Museum',
        location: 'High Desert Museum, South of Bend',
        description:
          "This world-class museum brings the high desert to life with live animal exhibits, interactive displays, and outdoor trails. Kids can see porcupines, raptors, and even watch a river otter feeding.",
        tips: [
          'Check the daily schedule for raptor flight shows and animal feedings',
          'The Desertarium lets kids crawl through tunnels and pop up in animal habitats',
          'Allow at least 2-3 hours to see everything',
          "Outdoor areas are stroller-accessible but can be warm in summer",
        ],
        duration: '2-3 hours',
        coordinates: [-121.3847, 43.9731],
        alternatives: [
          {
            title: 'Lava River Cave',
            description:
              'For more adventurous families: Explore a mile-long lava tube. Bring flashlights and warm clothes (it\'s 42°F inside year-round). Open May-September.',
          },
          {
            title: 'Lava Butte',
            description:
              'A quick volcanic adventure: Drive or shuttle to the top of this cinder cone for 360° views. The Lava Lands Visitor Center has great exhibits.',
          },
        ],
      },
      {
        id: 'treat-stop',
        time: '4:00 PM',
        title: 'Ice Cream at Goody\'s',
        location: "Goody's Chocolates & Ice Cream, Downtown Bend",
        description:
          'End the day with handmade ice cream and chocolates. This downtown institution has been satisfying sweet tooths since 1984.',
        tips: [
          'Try the Muddy Paws (chocolate ice cream with peanut butter cups)',
          'They also make their own chocolates and candy',
          'Small shop gets busy—be prepared to wait in line',
        ],
        duration: '30 minutes',
      },
    ],
    practicalInfo: {
      parking: [
        'McKay Cottage: Small lot fills quickly, street parking available',
        'River Trail: Free parking at First Street Rapids Park',
        'High Desert Museum: Large free lot',
      ],
      gear: [
        'Comfortable walking shoes',
        'Stroller or carrier for young kids',
        'Sunscreen and hats',
        'Snacks and water bottles',
        'Layers—museum is air-conditioned',
      ],
      accessibility:
        'All locations are wheelchair and stroller accessible. River Trail has paved and gravel sections.',
      budgetEstimate: '$80-120 for a family of 4 (museum admission, meals, treats)',
    },
    seoTitle: 'Family Activities in Bend Oregon | Kid-Friendly Day Trip Itinerary',
    seoDescription:
      "Plan the perfect family day in Bend, Oregon. This local guide includes kid-approved restaurants, easy trails, the High Desert Museum, and insider tips for traveling with children.",
  },

  // Guide 3: Adventurous Couples Escape
  {
    id: 'couples-escape',
    slug: 'adventurous-couples-escape',
    title: 'Adventurous Couples Escape',
    tagline: 'Romance meets adrenaline in Central Oregon',
    description:
      "Ditch the ordinary date night for an unforgettable adventure. This winter/spring-focused guide combines outdoor thrills with cozy moments, perfect for couples who'd rather summit a peak than sit through a movie.",
    heroImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80',
    duration: 'Full Day (10-12 hours)',
    difficulty: 'challenging',
    seasons: ['winter', 'spring'],
    bestFor: ['Active couples', 'Adventure seekers', 'Outdoor enthusiasts'],
    seasonalNotes: [
      {
        seasons: ['winter'],
        note: 'Peak season for skiing and snowshoeing. Check Mt. Bachelor conditions and book rentals in advance. Some trails may require avalanche awareness.',
      },
      {
        seasons: ['spring'],
        note: "Shoulder season offers mixed conditions—skiing in the morning, hiking in the afternoon is possible. Waterfall viewing is spectacular with snowmelt.",
      },
    ],
    stops: [
      {
        id: 'sunrise-activity',
        time: '6:30 AM',
        title: 'Sunrise Snowshoe at Dutchman Flat',
        location: 'Dutchman Flat Sno-Park, Cascade Lakes Highway',
        description:
          "Beat the crowds and experience the magic of a winter sunrise in the Cascades. This relatively flat snowshoe route offers stunning views of Broken Top and South Sister.",
        tips: [
          'Sno-Park permit required ($5/day or $25/season)',
          'Rent snowshoes at Wanderlust Tours or Powder House in Bend',
          'Bring a thermos of hot coffee or cocoa for a summit toast',
          'Headlamps needed for the pre-dawn start',
        ],
        duration: '2-3 hours',
        alternatives: [
          {
            title: 'Swampy Lakes Snowshoe',
            description:
              'A more challenging option with varied terrain and solitude. About 5 miles round trip.',
          },
        ],
      },
      {
        id: 'coffee-stop',
        time: '9:30 AM',
        title: 'Coffee at Backporch Coffee Roasters',
        location: 'Backporch Coffee Roasters, Bend',
        description:
          "Warm up with exceptional coffee at this cozy local roaster. The atmosphere is intimate and perfect for recounting your morning adventure.",
        tips: [
          'Try the house-made chai or a cortado',
          'The downtown location has a nice fireplace',
          'Light pastries available, but save your appetite for brunch',
        ],
        duration: '30-45 minutes',
      },
      {
        id: 'mid-day-adventure',
        time: '10:30 AM',
        title: 'Mt. Bachelor Skiing or Snowboarding',
        location: 'Mt. Bachelor Ski Resort',
        description:
          "Hit the slopes at one of the Pacific Northwest's premier ski resorts. With 4,300 acres of terrain and stunning volcanic scenery, there's something for every skill level.",
        tips: [
          'Book lift tickets online in advance for best prices',
          'The Northwest Territory has excellent intermediate terrain',
          'Summit chair offers advanced terrain and incredible views',
          'Rent gear at the mountain or save money at shops in Bend',
        ],
        duration: '3-4 hours',
        alternatives: [
          {
            title: 'Rock Climbing at Smith Rock (Spring)',
            description:
              'World-class sport climbing with routes for all levels. Consider hiring a guide for instruction.',
          },
          {
            title: 'Cross-Country Skiing at Meissner',
            description:
              'Groomed trails through beautiful forest. More intimate than downhill skiing.',
          },
        ],
      },
      {
        id: 'lunch',
        time: '2:30 PM',
        title: 'Late Lunch at Pine Tavern',
        location: 'Pine Tavern Restaurant, Downtown Bend',
        description:
          "This historic Bend landmark features a 250-year-old ponderosa pine growing through the dining room floor. The atmosphere is romantic without being stuffy.",
        tips: [
          'Request a table near the tree or by the window overlooking Mirror Pond',
          'Known for their prime rib and fresh-baked sourdough bread',
          'Reservations recommended for window seating',
        ],
        duration: '1.5 hours',
      },
      {
        id: 'afternoon-activity',
        time: '4:30 PM',
        title: 'Tumalo Falls Winter Hike',
        location: 'Tumalo Falls Day Use Area',
        description:
          "A short hike to one of Oregon's most beautiful waterfalls. In winter, the falls are partially frozen, creating a magical ice sculpture.",
        tips: [
          'The road may be closed in winter—plan for a longer snowshoe approach',
          'Microspikes or traction devices recommended for icy trails',
          'Golden hour light makes the falls glow',
          'Check road conditions at fs.usda.gov before going',
        ],
        duration: '1-2 hours',
        isOptional: true,
      },
      {
        id: 'dinner',
        time: '7:00 PM',
        title: 'Romantic Dinner at Ariana',
        location: 'Ariana Restaurant, Downtown Bend',
        description:
          "End your adventure with farm-to-table cuisine in an intimate, candlelit setting. Chef Ariana Fernandez creates seasonally-inspired dishes that have earned national recognition.",
        tips: [
          'Reservations essential—book at least a week ahead',
          'The tasting menu is a splurge-worthy experience',
          'Excellent wine list featuring Oregon producers',
          'Dietary restrictions easily accommodated with advance notice',
        ],
        duration: '2 hours',
        alternatives: [
          {
            title: 'Zydeco Kitchen & Cocktails',
            description:
              'Southern-inspired cuisine with great cocktails. More casual but equally delicious.',
          },
        ],
      },
      {
        id: 'nightcap',
        time: '9:00 PM',
        title: 'Nightcap at The Capitol',
        location: 'The Capitol, Downtown Bend',
        description:
          "A sophisticated cocktail bar in a beautifully restored historic building. Perfect for toasting your epic day over craft cocktails.",
        tips: [
          'Craft cocktails made with house-made ingredients',
          'Live jazz some evenings—check their schedule',
          'Cozy booths for intimate conversation',
        ],
        duration: '1 hour',
        isOptional: true,
      },
    ],
    practicalInfo: {
      permits: [
        'Sno-Park permit required at Dutchman Flat ($5/day or $25/season)',
        'Mt. Bachelor lift tickets (book online for best rates)',
      ],
      parking: [
        'Dutchman Flat: Small Sno-Park lot, arrive early',
        'Mt. Bachelor: Large lots, free parking',
        'Downtown Bend: Metered parking, free after 6 PM',
      ],
      gear: [
        'Ski/snowboard gear or snowshoes (rentals available)',
        'Layered clothing for variable conditions',
        'Sunglasses and sunscreen (snow reflection is intense)',
        'Change of clothes for dinner',
        'Traction devices for icy trails',
      ],
      budgetEstimate: '$300-500 for two (lift tickets, rentals, meals, drinks)',
    },
    seoTitle: 'Romantic Adventure Weekend in Bend Oregon | Couples Outdoor Getaway Guide',
    seoDescription:
      'Plan an adventurous couples escape in Bend, Oregon. Combine skiing at Mt. Bachelor, snowshoeing at sunrise, and romantic dinners in this local guide to outdoor date ideas.',
  },

  // Guide 4: Central Oregon Waterfall Quest
  {
    id: 'waterfall-quest',
    slug: 'central-oregon-waterfall-quest',
    title: 'Central Oregon Waterfall Quest',
    tagline: 'Chase cascades from the high desert to the forests',
    description:
      "Discover the surprising abundance of waterfalls in Central Oregon. From thundering Tumalo Falls to the hidden gems of the Deschutes National Forest, this driving route connects the region's most spectacular cascades.",
    heroImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80',
    duration: 'Full Day (9-10 hours)',
    difficulty: 'moderate',
    seasons: ['spring', 'summer', 'fall'],
    bestFor: ['Waterfall enthusiasts', 'Hikers', 'Nature photographers'],
    seasonalNotes: [
      {
        seasons: ['spring'],
        note: 'Peak waterfall season! Snowmelt creates the most dramatic flows, typically mid-April through early June. Some roads may still be closed—check conditions.',
      },
      {
        seasons: ['summer'],
        note: 'Lower water levels but all roads accessible. Early morning visits avoid crowds. Some falls may be reduced to trickles by late August.',
      },
      {
        seasons: ['fall'],
        note: 'Beautiful fall colors frame many waterfalls. Water levels vary. Some forest roads close in late October.',
      },
      {
        seasons: ['winter'],
        note: 'Most waterfall access roads are closed. Tumalo Falls is accessible via snowshoe. Partially frozen falls are spectacular but require winter gear.',
      },
    ],
    stops: [
      {
        id: 'coffee-start',
        time: '7:30 AM',
        title: 'Coffee at Lone Pine Coffee Roasters',
        location: 'Lone Pine Coffee Roasters, Bend',
        description:
          "Fuel up for your waterfall adventure at this excellent local roaster. Grab a coffee and a breakfast sandwich for the road.",
        tips: [
          'Get coffee to go—your first waterfall is 20 minutes away',
          'Their breakfast burritos are substantial and travel well',
          'Fill up your water bottles here',
        ],
        duration: '20 minutes',
      },
      {
        id: 'tumalo-falls',
        time: '8:00 AM',
        title: 'Tumalo Falls',
        location: 'Tumalo Falls Day Use Area',
        description:
          "Start with the crown jewel of Central Oregon waterfalls. At 97 feet, Tumalo Falls is accessible via a short walk from the parking area, with morning light illuminating the cascade beautifully.",
        tips: [
          'Arrive early to beat crowds—this is Bend\'s most popular waterfall',
          'The viewpoint is just 0.2 miles from parking',
          'For photographers: Morning light from the viewing platform is ideal',
          'Continue up the trail to see smaller upper falls (adds 2 miles)',
        ],
        duration: '1-1.5 hours',
        coordinates: [-121.5667, 44.0367],
      },
      {
        id: 'benham-falls',
        time: '10:00 AM',
        title: 'Benham Falls',
        location: 'Benham Falls West Day Use Area',
        description:
          "A dramatic set of rapids and cascades on the Deschutes River. While technically more rapids than waterfall, the power of the river here is awe-inspiring.",
        tips: [
          'West trailhead is easier; 1 mile round trip on flat trail',
          'The falls are most impressive during high water (spring)',
          'Excellent spot for long-exposure photography',
          'Swimming and wading are prohibited—currents are deadly',
        ],
        duration: '1 hour',
        coordinates: [-121.4103, 43.9356],
      },
      {
        id: 'dillon-falls',
        time: '11:30 AM',
        title: 'Dillon Falls',
        location: 'Dillon Falls Day Use Area',
        description:
          "Another powerful Deschutes River cascade, this 15-foot drop creates impressive whitewater. The forested trail offers a peaceful hike to reach the viewpoint.",
        tips: [
          'Moderate 4-mile round trip hike through ponderosa forest',
          'Multiple viewpoints along the way',
          'Can be combined with Benham Falls for a longer river trail hike',
          'Bring a snack—this is a good mid-hike break spot',
        ],
        duration: '1.5 hours',
        coordinates: [-121.4047, 43.9108],
      },
      {
        id: 'lunch-stop',
        time: '1:00 PM',
        title: 'Picnic at Lava Island Falls',
        location: 'Lava Island Falls, Deschutes River',
        description:
          "Take a break for lunch at this scenic day-use area. The wide cascade spreads across ancient lava formations, creating a unique backdrop for your picnic.",
        tips: [
          'Pack a lunch—there are no food options nearby',
          'Picnic tables available at the day-use area',
          'Short, easy walk to the falls viewpoint',
          'Great spot to rest your feet in the cool river (in summer)',
        ],
        duration: '1 hour',
      },
      {
        id: 'paulina-falls',
        time: '2:30 PM',
        title: 'Paulina Falls',
        location: 'Newberry National Volcanic Monument',
        description:
          "A stunning 80-foot double waterfall in a volcanic caldera setting. The unique geology adds drama to an already spectacular cascade.",
        tips: [
          'About 30-minute drive from Bend',
          'Two viewing platforms—lower offers spray, upper offers panoramic views',
          'Northwest Forest Pass required',
          'Combine with Paulina Lake for additional scenery',
        ],
        duration: '1 hour',
        coordinates: [-121.2756, 43.7081],
      },
      {
        id: 'fall-river-falls',
        time: '4:00 PM',
        title: 'Fall River Falls',
        location: 'Fall River, near La Pine',
        description:
          "A unique spring-fed waterfall where the Fall River emerges from underground and immediately drops over a basalt ledge. The crystal-clear water is mesmerizing.",
        tips: [
          'Very short walk from parking area',
          'The river emerges from springs just upstream—geology is fascinating',
          'Water temperature is constant year-round (cold!)',
          'Less crowded than Tumalo Falls',
        ],
        duration: '30 minutes',
      },
      {
        id: 'sunset-finale',
        time: '5:30 PM',
        title: 'Return via Cascade Lakes',
        location: 'Cascade Lakes Scenic Byway (Summer/Fall only)',
        description:
          "If time and season permit, return to Bend via the Cascade Lakes Highway for golden hour views of the volcanic peaks reflected in alpine lakes.",
        tips: [
          'This route adds about 30 minutes to your return',
          'Highway typically open late May through October',
          'Sparks Lake and Devils Lake offer excellent sunset views',
          'Keep eyes peeled for wildlife at dusk',
        ],
        duration: '1.5 hours',
        isOptional: true,
      },
    ],
    practicalInfo: {
      permits: [
        'Northwest Forest Pass required at Tumalo Falls, Paulina Falls',
        'Day-use fees may apply at some Deschutes River sites',
      ],
      parking: [
        'Tumalo Falls: Popular lot fills by 9 AM on weekends',
        'Benham/Dillon Falls: Adequate parking, rarely full',
        'Paulina Falls: Large lot at visitor center',
      ],
      gear: [
        'Sturdy hiking shoes (trails can be rocky/rooty)',
        'Trekking poles helpful for Dillon Falls trail',
        'Layers—temperatures vary from river to caldera',
        'Waterproof bag for camera gear (mist from falls)',
        'Packed lunch and plenty of water',
        'Binoculars for wildlife spotting',
      ],
      budgetEstimate: '$15-25 for passes, plus food',
    },
    seoTitle: 'Best Waterfalls Near Bend Oregon | Complete Waterfall Driving Tour',
    seoDescription:
      "Explore the best waterfalls near Bend, Oregon with this complete driving tour. From Tumalo Falls to Paulina Falls, discover hiking tips, seasonal advice, and photography spots.",
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuidesByDifficulty(difficulty: Guide['difficulty']): Guide[] {
  return guides.filter((guide) => guide.difficulty === difficulty);
}

export function getGuidesBySeason(season: Guide['seasons'][number]): Guide[] {
  return guides.filter((guide) => guide.seasons.includes(season));
}
