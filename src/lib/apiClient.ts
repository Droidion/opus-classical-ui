import ky from 'ky'
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

export async function getComposersByPeriods(): Promise<ComposersByPeriods> {
  return await ky.get(`${getBaseUrl()}/public/composers`).json()
}

export async function getSearchComposersData(): Promise<FoundComposers> {
  return await ky.get(`${getBaseUrl(false)}/public/composers/search`).json()
}

export async function getComposerBySlug(slug: string): Promise<ComposerBySlug> {
  return await ky.get(`${getBaseUrl()}/public/composer/slug/${slug}`).json()
}

export async function getWorksByGenres(
  composerId: number,
): Promise<WorksByGenres> {
  return await ky
    .get(`${getBaseUrl()}/public/composer/id/${composerId}/works`)
    .json()
}

export async function getWorkMetadata(workId: number): Promise<WorkMetadata> {
  return await ky.get(`${getBaseUrl()}/public/works/${workId}`).json()
}

export async function getRecordingsByWork(
  workId: number,
): Promise<RecordingsByWork> {
  return await ky
    .get(`${getBaseUrl()}/public/works/${workId}/recordings`)
    .json()
}
