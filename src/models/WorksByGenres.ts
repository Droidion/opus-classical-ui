import type { Work } from './Work'

export type WorksByGenres = {
  genreName: string;
  genreId: number;
  works: Work[];
}[]
