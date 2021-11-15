import type { ExecaReturnValue } from 'execa'
import {
  boolean,
  intersection,
  number,
  partial,
  string,
  type
} from 'io-ts'

const ExecaReturnValueType = intersection([
  type({
    command: string,
    escapedCommand: string,
    exitCode: number,
    failed: boolean,
    timedOut: boolean,
    killed: boolean,
    isCanceled: boolean
  }),
  partial({
    signal: string,
    signalDescription: string
  })
])

export const isExecaReturnValue = (value: unknown): value is ExecaReturnValue => {
  return ExecaReturnValueType.is(value)
}
