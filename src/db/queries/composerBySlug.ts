import { eq } from 'drizzle-orm'
import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { composers } from '../schema/composers'
import { getCountriesByComposer } from './countriesByComposer'

export const ComposerBySlug = Type.Object({
  id: Type.Number(),
  firstName: Type.String(),
  lastName: Type.String(),
  yearBorn: Type.Number(),
  yearDied: Type.Union([Type.Null(), Type.Number()]),
  slug: Type.String(),
  wikipediaLink: Type.Union([Type.Null(), Type.String()]),
  imslpLink: Type.Union([Type.Null(), Type.String()]),
  countries: Type.String(),
})

export type ComposerBySlug = Static<typeof ComposerBySlug>

export async function getComposerBySlug(
  db: DrizzleDb,
  slug: string,
): Promise<ComposerBySlug> {
  const composerData = await db
    .select({
      id: composers.id,
      firstName: composers.firstName,
      lastName: composers.lastName,
      yearBorn: composers.yearBorn,
      yearDied: composers.yearDied,
      slug: composers.slug,
      wikipediaLink: composers.wikipediaLink,
      imslpLink: composers.imslpLink,
    })
    .from(composers)
    .where(eq(composers.slug, slug))

  if (composerData[0]) {
    const countriesData = await getCountriesByComposer(db, composerData[0].id)
    return {
      ...composerData[0],
      countries: countriesData.map(country => country.name).join(', '),
    }
  } else {
    throw new Error(`Composer with slug ${slug} not found`)
  }
}
