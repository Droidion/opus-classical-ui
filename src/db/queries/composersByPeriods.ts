import { eq, sql } from 'drizzle-orm'
import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { composers, composersCountries, countries, periods } from '../schema'

export const Composer = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  yearBorn: Type.Number(),
  yearDied: Type.Union([Type.Null(), Type.Number()]),
  periodId: Type.Number(),
  slug: Type.String(),
  countries: Type.String(),
})

export type Composer = Static<typeof Composer>

export const ComposersByPeriods = Type.Array(
  Type.Object({
    id: Type.Number(),
    name: Type.String(),
    yearStart: Type.Union([Type.Null(), Type.Number()]),
    yearEnd: Type.Union([Type.Null(), Type.Number()]),
    composers: Type.Array(Composer),
  }),
)

export type ComposersByPeriods = Static<typeof ComposersByPeriods>

export async function getComposersByPeriods(
  db: DrizzleDb,
): Promise<ComposersByPeriods> {
  const periodsData = await db
    .select({
      id: periods.id,
      name: periods.name,
      yearStart: periods.yearStart,
      yearEnd: periods.yearEnd,
    })
    .from(periods)
    .orderBy(periods.yearStart)

  const composersData = await db
    .select({
      firstName: composers.firstName,
      lastName: composers.lastName,
      yearBorn: composers.yearBorn,
      yearDied: composers.yearDied,
      periodId: composers.periodId,
      slug: composers.slug,
      countries: sql<string>`GROUP_CONCAT(${countries.name}, ', ')`,
    })
    .from(composers)
    .innerJoin(
      composersCountries,
      eq(composersCountries.composerId, composers.id),
    )
    .innerJoin(countries, eq(composersCountries.countryId, countries.id))
    .where(eq(composers.enabled, true))
    .groupBy(
      composers.firstName,
      composers.lastName,
      composers.yearBorn,
      composers.yearDied,
      composers.periodId,
      composers.slug,
    )
    .orderBy(composers.lastName)

  return periodsData.reduce((acc: ComposersByPeriods, periodItem) => {
    acc.push({
      ...periodItem,
      composers: composersData.filter(com => com.periodId === periodItem.id),
    })
    return acc
  }, [])
}
