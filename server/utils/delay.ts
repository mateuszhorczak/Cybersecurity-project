import type { H3Event } from 'h3'

const delayCache = new WeakMap<H3Event, number>()

export const delayResponse = async (event: H3Event, time: number) => {
  const alreadyDelayed = delayCache.get(event) ?? 0

  if (time > alreadyDelayed) {
    delayCache.set(event, time)
    await sleep(time - alreadyDelayed)
  }
}
