import type { ComposerBySlug } from 'src/models/ComposerBySlug'
import type { ComposersByPeriods } from 'src/models/ComposersByPeriods'
import type { FoundComposers } from 'src/models/FoundComposers'
import type { RecordingsByWork } from 'src/models/RecordingsByWork'
import type { WorkMetadata } from 'src/models/WorkMetadata'
import type { WorksByGenres } from 'src/models/WorksByGenres'

function getBaseUrl(ssr = true): string {
  return (
    (ssr ? process.env.PUBLIC_API_URL : import.meta.env.PUBLIC_API_URL) ??
    'http://localhost:3000  '
  )
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return (await response.json()) as T
}

export async function getComposersByPeriods(): Promise<ComposersByPeriods> {
  return await fetchJson(`${getBaseUrl()}/public/composers`)
}

export async function getSearchComposersData(): Promise<FoundComposers> {
  return await fetchJson(`${getBaseUrl(false)}/public/composers/search`)
}

export async function getComposerBySlug(slug: string): Promise<ComposerBySlug> {
  return await fetchJson(`${getBaseUrl()}/public/composer/slug/${slug}`)
}

export async function getWorksByGenres(
  composerId: number,
): Promise<WorksByGenres> {
  return await fetchJson(
    `${getBaseUrl()}/public/composer/id/${composerId}/works`,
  )
}

export async function getWorkMetadata(workId: number): Promise<WorkMetadata> {
  return await fetchJson(`${getBaseUrl()}/public/works/${workId}`)
}

export async function getRecordingsByWork(
  workId: number,
): Promise<RecordingsByWork> {
  return await fetchJson(`${getBaseUrl()}/public/works/${workId}/recordings`)
}
