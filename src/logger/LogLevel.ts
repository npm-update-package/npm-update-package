export const LogLevel = {
  Debug: 'debug',
  Error: 'error',
  Fatal: 'fatal',
  Info: 'info',
  Off: 'off',
  Trace: 'trace',
  Warn: 'warn'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogLevel = typeof LogLevel[keyof typeof LogLevel]
const logLevels = Object.values(LogLevel)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const isLogLevel = (value: any): value is LogLevel => logLevels.includes(value)
