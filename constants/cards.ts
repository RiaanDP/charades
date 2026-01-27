export interface Card {
  id: string;
  text: string;
  categoryId: string;
}

export const ANIMAL_CARDS: Card[] = [
  { id: '1', text: 'Lion', categoryId: 'animals' },
  { id: '2', text: 'Elephant', categoryId: 'animals' },
  { id: '3', text: 'Giraffe', categoryId: 'animals' },
  { id: '4', text: 'Monkey', categoryId: 'animals' },
  { id: '5', text: 'Penguin', categoryId: 'animals' },
  { id: '6', text: 'Kangaroo', categoryId: 'animals' },
  { id: '7', text: 'Bear', categoryId: 'animals' },
  { id: '8', text: 'Tiger', categoryId: 'animals' },
  { id: '9', text: 'Zebra', categoryId: 'animals' },
  { id: '10', text: 'Dolphin', categoryId: 'animals' },
  { id: '11', text: 'Shark', categoryId: 'animals' },
  { id: '12', text: 'Eagle', categoryId: 'animals' },
  { id: '13', text: 'Snake', categoryId: 'animals' },
  { id: '14', text: 'Crocodile', categoryId: 'animals' },
  { id: '15', text: 'Flamingo', categoryId: 'animals' },
  { id: '16', text: 'Gorilla', categoryId: 'animals' },
  { id: '17', text: 'Cheetah', categoryId: 'animals' },
  { id: '18', text: 'Hippopotamus', categoryId: 'animals' },
  { id: '19', text: 'Rhinoceros', categoryId: 'animals' },
  { id: '20', text: 'Panda', categoryId: 'animals' },
  { id: '21', text: 'Koala', categoryId: 'animals' },
  { id: '22', text: 'Sloth', categoryId: 'animals' },
  { id: '23', text: 'Octopus', categoryId: 'animals' },
  { id: '24', text: 'Jellyfish', categoryId: 'animals' },
  { id: '25', text: 'Seahorse', categoryId: 'animals' },
  { id: '26', text: 'Butterfly', categoryId: 'animals' },
  { id: '27', text: 'Bee', categoryId: 'animals' },
  { id: '28', text: 'Ladybug', categoryId: 'animals' },
  { id: '29', text: 'Spider', categoryId: 'animals' },
  { id: '30', text: 'Bat', categoryId: 'animals' },
  { id: '31', text: 'Owl', categoryId: 'animals' },
  { id: '32', text: 'Parrot', categoryId: 'animals' },
  { id: '33', text: 'Peacock', categoryId: 'animals' },
  { id: '34', text: 'Turkey', categoryId: 'animals' },
  { id: '35', text: 'Ostrich', categoryId: 'animals' },
  { id: '36', text: 'Camel', categoryId: 'animals' },
  { id: '37', text: 'Horse', categoryId: 'animals' },
  { id: '38', text: 'Pig', categoryId: 'animals' },
  { id: '39', text: 'Sheep', categoryId: 'animals' },
  { id: '40', text: 'Goat', categoryId: 'animals' },
  { id: '41', text: 'Cow', categoryId: 'animals' },
  { id: '42', text: 'Chicken', categoryId: 'animals' },
  { id: '43', text: 'Duck', categoryId: 'animals' },
  { id: '44', text: 'Rabbit', categoryId: 'animals' },
  { id: '45', text: 'Squirrel', categoryId: 'animals' },
  { id: '46', text: 'Raccoon', categoryId: 'animals' },
  { id: '47', text: 'Fox', categoryId: 'animals' },
  { id: '48', text: 'Wolf', categoryId: 'animals' },
  { id: '49', text: 'Deer', categoryId: 'animals' },
  { id: '50', text: 'Moose', categoryId: 'animals' },
];

export const getCardsByCategory = (categoryId: string): Card[] => {
  switch (categoryId) {
    case 'animals':
      return ANIMAL_CARDS;
    default:
      return [];
  }
};

export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
