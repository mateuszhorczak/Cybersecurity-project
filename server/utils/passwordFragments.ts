import argon2 from 'argon2'

export async function generatePasswordFragments(
  fullPassword: string,
  count = 15,
) {
  const metadata = []
  const minFragmentLength = 6
  const maxFragmentLength = Math.floor(fullPassword.length / 2)
  const used = new Set<string>()

  while (metadata.length < count) {
    const length =
      Math.floor(Math.random() * (maxFragmentLength - minFragmentLength + 1))
      + minFragmentLength
    const start = Math.floor(Math.random() * (fullPassword.length - length + 1))
    const key = `${start}-${length}`

    if (used.has(key)) continue
    used.add(key)

    const fragment = fullPassword.slice(start, start + length)
    metadata.push({ startPosition: start, length, fragment })
  }

  const fragments = await Promise.all(
    metadata.map(async ({ startPosition, length, fragment }) => {
      const fragmentHash = await argon2.hash(fragment)
      return {
        startPosition,
        length,
        fragmentHash,
      }
    }),
  )

  return fragments
}
