import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'events',
    name: 'Events',
    description: 'Festivals, live music, markets, and community gatherings',
    icon: 'Calendar',
    color: 'bg-mountain',
    href: '/events',
  },
  {
    id: 'outdoor',
    name: 'Outdoor Activities',
    description: 'Hiking, skiing, mountain biking, and nature adventures',
    icon: 'Mountain',
    color: 'bg-forest',
    href: '/category/outdoor',
  },
  {
    id: 'food',
    name: 'Food & Drink',
    description: 'Breweries, restaurants, and local favorites',
    icon: 'UtensilsCrossed',
    color: 'bg-earth',
    href: '/category/food',
  },
  {
    id: 'kids',
    name: 'Bendy Kids',
    description: 'Family fun, museums, play spaces, and kid-friendly adventures',
    icon: 'Baby',
    color: 'bg-purple-500',
    href: '/category/kids',
  },
];
