import { and, eq, isNull } from 'drizzle-orm'
import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { catalogues } from '../schema'
import { genres } from '../schema/genres'
import { works } from '../schema/works'

export const Work = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  yearStart: Type.Union([Type.Null(), Type.Number()]),
  yearFinish: Type.Union([Type.Null(), Type.Number()]),
  averageMintues: Type.Number(),
  catalogueName: Type.Union([Type.Null(), Type.String()]),
  catalogueNumber: Type.Union([Type.Null(), Type.Number()]),
  cataloguePostfix: Type.Union([Type.Null(), Type.String()]),
  no: Type.Union([Type.Null(), Type.Number()]),
  nickname: Type.Union([Type.Null(), Type.String()]),
  genreName: Type.String(),
})

export type Work = Static<typeof Work>

export const WorksByGenres = Type.Array(
  Type.Object({
    genreId: Type.Number(),
    genreName: Type.String(),
    works: Type.Array(Work),
  }),
)

export type WorksByGenres = Static<typeof WorksByGenres>

export async function getWorksByGenres(
  db: DrizzleDb,
  composerId: number,
): Promise<WorksByGenres> {
  const worksData = await db
    .select({
      id: works.id,
      title: works.title,
      yearStart: works.yearStart,
      yearFinish: works.yearFinish,
      averageMintues: works.averageMintues,
      catalogueName: catalogues.name,
      catalogueNumber: works.catalogueNumber,
      cataloguePostfix: works.cataloguePostfix,
      no: works.no,
      nickname: works.nickname,
      genreId: genres.id,
      genreName: genres.name,
    })
    .from(works)
    .innerJoin(genres, eq(genres.id, works.genreId))
    .leftJoin(catalogues, eq(catalogues.id, works.catalogueId))
    .where(and(eq(works.composerId, composerId), isNull(works.parentWorkId)))
    .orderBy(genres.name, works.sort, works.yearFinish)

  return worksData.reduce((result: WorksByGenres, obj) => {
    const target = result.find(group => group.genreId === obj.genreId)
    if (target) {
      target.works.push(obj)
    } else {
      result.push({
        genreName: obj.genreName,
        genreId: obj.genreId,
        works: [obj],
      })
    }
    return result
  }, [])
}
