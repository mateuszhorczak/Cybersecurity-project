const SECOND_MS = 1000

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * SECOND_MS))
}
