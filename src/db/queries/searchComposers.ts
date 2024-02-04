import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { composers } from '../schema/composers'

export const FoundComposers = Type.Array(
  Type.Object({
    firstName: Type.String(),
    lastName: Type.String(),
    slug: Type.String(),
  }),
)

export type FoundComposers = Static<typeof FoundComposers>

export async function searchComposers(db: DrizzleDb): Promise<FoundComposers> {
  return await db
    .select({
      firstName: composers.firstName,
      lastName: composers.lastName,
      slug: composers.slug,
    })
    .from(composers)
}
