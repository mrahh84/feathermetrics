export interface EggLog {
  date: string;
  count: number;
}

export interface MortalityLog {
  date: string;
  count: number;
  reason?: string;
}

export interface FeedLog {
  date: string;
  quantityKg: number;
  cost: number;
}

export interface Sale {
  date: string;
  item: 'Eggs' | 'Chicken';
  quantity: number;
  price: number;
}

export interface Expense {
  date: string;
  item: string;
  cost: number;
}

export interface FlockData {
  id: string;
  name: string;
  breed: string;
  initialCount: number;
  acquisitionDate: string;
  eggLogs: EggLog[];
  mortalityLogs: MortalityLog[];
  feedLogs: FeedLog[];
  sales: Sale[];
  expenses: Expense[];
}
