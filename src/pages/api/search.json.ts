import type { APIRoute } from 'astro'
import { dbConnect } from '@db/connect'
import { searchComposers } from '@db/queries/searchComposers'

export const GET: APIRoute = async () => {
  const composers = await searchComposers(dbConnect())
  return new Response(JSON.stringify(composers))
}
