import type { Composer } from './Composer'

export type ComposersByPeriods = {
  id: number;
  yearStart: number | null;
  name: string;
  yearEnd: number | null;
  composers: Composer[];
}[]
