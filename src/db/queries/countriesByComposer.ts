import { eq } from 'drizzle-orm'
import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { composersCountries, countries } from '../schema'

export const CountriesByComposer = Type.Array(
  Type.Object({
    name: Type.String(),
  }),
)

export type CountriesByComposer = Static<typeof CountriesByComposer>

export async function getCountriesByComposer(
  db: DrizzleDb,
  composerId: number,
): Promise<CountriesByComposer> {
  return await db
    .select({
      name: countries.name,
    })
    .from(countries)
    .innerJoin(
      composersCountries,
      eq(composersCountries.countryId, countries.id),
    )
    .where(eq(composersCountries.composerId, composerId))
}
