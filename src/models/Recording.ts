import type { Performer } from './Performer'
import type { Streamer } from './Streamer'

export type Recording = {
  id: number;
  coverName: string;
  length: number;
  label: string | null;
  workId: number;
  yearStart: number | null;
  yearFinish: number;
  performers: Performer[];
  streamers: Streamer[];
}
