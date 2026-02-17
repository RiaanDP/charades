export interface Category {
  id: string;
  name: string;
  description: string;
  cardCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    description: 'Creatures from around the world',
    cardCount: 50,
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Fun for the whole family - ages 5 and up',
    cardCount: 250,
  },
];
