import { and, eq, sql } from 'drizzle-orm'
import { sort } from 'fast-sort'
import { Type, type Static } from '@sinclair/typebox'
import type { DrizzleDb } from '../connect'
import { filterUniqueBy } from '../../lib/filterByUniqueId'
import {
  instruments,
  performers,
  performersRecordingsInstruments,
  recordings,
  recordingsStreamers,
  streamers,
} from '../schema'
import { labels } from '../schema/labels'

export const Performer = Type.Object({
  firstName: Type.Union([Type.Null(), Type.String()]),
  lastName: Type.String(),
  instrument: Type.String(),
  sort: Type.Union([Type.Null(), Type.Number()]),
})

export type Performer = Static<typeof Performer>

export const Streamer = Type.Object({
  link: Type.String(),
  streamer: Type.String(),
  prefix: Type.String(),
  icon: Type.String(),
})

export type Streamer = Static<typeof Streamer>

export const Recording = Type.Object({
  id: Type.Number(),
  coverName: Type.String(),
  length: Type.Number(),
  label: Type.Union([Type.Null(), Type.String()]),
  workId: Type.Number(),
  yearStart: Type.Union([Type.Null(), Type.Number()]),
  yearFinish: Type.Number(),
  performers: Type.Array(Performer),
  streamers: Type.Array(Streamer),
})

export type Recording = Static<typeof Recording>

export const RecordingsByWork = Type.Array(Recording)

export type RecordingsByWork = Static<typeof RecordingsByWork>

export async function getRecordingsByWork(
  db: DrizzleDb,
  workId: number,
): Promise<RecordingsByWork> {
  const results = await db
    .select({
      id: recordings.id,
      coverName: recordings.coverName,
      length: recordings.length,
      label: labels.name,
      workId: recordings.workId,
      yearStart: recordings.yearStart,
      yearFinish: recordings.yearFinish,
      performers: sql<string>`json_group_array(json_object('firstName', ${performers.firstName}, 'lastName', ${performers.lastName}, 'instrument', ${instruments.name}, 'sort', ${performersRecordingsInstruments.priority}))`,
      streamers: sql<string>`json_group_array(json_object('link', ${recordingsStreamers.link}, 'streamer', ${streamers.name}, 'prefix', ${streamers.appPrefix}, 'icon', ${streamers.iconName}))`,
    })
    .from(recordings)
    .leftJoin(labels, eq(recordings.labelId, labels.id))
    .leftJoin(
      recordingsStreamers,
      and(
        eq(recordings.id, recordingsStreamers.recordingId),
        eq(recordingsStreamers.isShow, true),
      ),
    )
    .leftJoin(streamers, eq(streamers.id, recordingsStreamers.streamerId))
    .leftJoin(
      performersRecordingsInstruments,
      eq(recordings.id, performersRecordingsInstruments.recordingId),
    )
    .leftJoin(
      performers,
      eq(performers.id, performersRecordingsInstruments.performerId),
    )
    .leftJoin(
      instruments,
      eq(instruments.id, performersRecordingsInstruments.instrumentId),
    )
    .groupBy(
      recordings.id,
      recordings.coverName,
      recordings.length,
      labels.name,
      recordings.workId,
      recordings.yearStart,
      recordings.yearFinish,
    )
    .orderBy(recordings.yearFinish)
    .where(eq(recordings.workId, workId))
  return results.map(el => ({
    ...el,
    streamers: sort(
      filterUniqueBy(JSON.parse(el.streamers) as Streamer[], 'link'),
    ).asc(s => s.streamer),
    performers: sort(
      filterUniqueBy(
        JSON.parse(el.performers) as Performer[],
        'lastName',
        'firstName',
      ),
    ).asc(s => s.sort),
  }))
}
