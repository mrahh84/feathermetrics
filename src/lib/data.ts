import type { FlockData } from './types';
import { subDays, format } from 'date-fns';

const today = new Date();

export const flock: FlockData = {
  id: 'flock-01',
  name: 'Sunrise Layers',
  breed: 'ISA Brown',
  initialCount: 50,
  acquisitionDate: format(subDays(today, 180), 'yyyy-MM-dd'),
  eggLogs: Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(today, 30 - i), 'yyyy-MM-dd'),
    count: 40 + Math.floor(Math.random() * 8) - i / 5, // slight decline
  })),
  mortalityLogs: [
    { date: format(subDays(today, 95), 'yyyy-MM-dd'), count: 1, reason: 'Unknown' },
    { date: format(subDays(today, 20), 'yyyy-MM-dd'), count: 1, reason: 'Predator' },
  ],
  feedLogs: Array.from({ length: 12 }, (_, i) => ({
    date: format(subDays(today, (12 - i) * 7), 'yyyy-MM-dd'),
    quantityKg: 20 + Math.random() * 2,
    cost: 15 + Math.random(),
  })),
  sales: [
    ...Array.from({ length: 8 }, (_, i) => ({
      date: format(subDays(today, (8 - i) * 7), 'yyyy-MM-dd'),
      item: 'Eggs' as const,
      quantity: 20 + Math.floor(Math.random() * 5), // dozens
      price: (20 + Math.floor(Math.random() * 5)) * 3.5,
    })),
     {
      date: format(subDays(today, 40), 'yyyy-MM-dd'),
      item: 'Chicken' as const,
      quantity: 5,
      price: 5 * 12,
    }
  ],
  expenses: Array.from({ length: 4 }, (_, i) => ({
    date: format(subDays(today, (4 - i) * 30), 'yyyy-MM-dd'),
    item: i % 2 === 0 ? 'Feed Purchase' : 'Medication/Supplements',
    cost: i % 2 === 0 ? 120 + Math.random() * 20 : 45 + Math.random() * 10,
  })),
};
