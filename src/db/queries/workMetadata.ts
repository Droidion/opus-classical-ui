import { eq } from 'drizzle-orm'
import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { catalogues } from '../schema/catalogues'
import { composers } from '../schema/composers'
import { works } from '../schema/works'

export const WorkMetadata = Type.Object({
  title: Type.String(),
  composerFirstName: Type.String(),
  composerLastName: Type.String(),
  composerSlug: Type.String(),
  catalogueName: Type.Union([Type.Null(), Type.String()]),
  catalogueNumber: Type.Union([Type.Null(), Type.Number()]),
  cataloguePostfix: Type.Union([Type.Null(), Type.String()]),
  yearStart: Type.Union([Type.Null(), Type.Number()]),
  yearFinish: Type.Union([Type.Null(), Type.Number()]),
  no: Type.Union([Type.Null(), Type.Number()]),
  nickname: Type.Union([Type.Null(), Type.String()]),
})

export type WorkMetadata = Static<typeof WorkMetadata>

export async function getWorkMetadata(
  db: DrizzleDb,
  workId: number,
): Promise<WorkMetadata> {
  const allWorks = await db
    .select({
      title: works.title,
      composerFirstName: composers.firstName,
      composerLastName: composers.lastName,
      composerSlug: composers.slug,
      catalogueName: catalogues.name,
      catalogueNumber: works.catalogueNumber,
      cataloguePostfix: works.cataloguePostfix,
      yearStart: works.yearStart,
      yearFinish: works.yearFinish,
      no: works.no,
      nickname: works.nickname,
    })
    .from(works)
    .innerJoin(composers, eq(composers.id, works.composerId))
    .leftJoin(catalogues, eq(catalogues.id, works.catalogueId))
    .where(eq(works.id, workId))

  if (allWorks[0]) {
    return allWorks[0]
  }

  throw new Error(`Work with id ${workId} not found`)
}
