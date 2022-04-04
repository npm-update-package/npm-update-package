// TODO: Add test
export function * range (
  start: number,
  end: number
): Generator<number, void, void> {
  for (let i = start; i <= end; i++) {
    yield i
  }
}
