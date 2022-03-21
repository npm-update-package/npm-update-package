import { createLogger } from './createLogger'
import { LogLevel } from './LogLevel'

describe('createLogger', () => {
  describe('returns new Logger instance', () => {
    interface TestCase {
      logLevel: LogLevel
      expected: {
        isFatalEnabled: boolean
        isErrorEnabled: boolean
        isWarnEnabled: boolean
        isInfoEnabled: boolean
        isDebugEnabled: boolean
        isTraceEnabled: boolean
      }
    }
    const cases: TestCase[] = [
      {
        logLevel: LogLevel.Off,
        expected: {
          isFatalEnabled: false,
          isErrorEnabled: false,
          isWarnEnabled: false,
          isInfoEnabled: false,
          isDebugEnabled: false,
          isTraceEnabled: false
        }
      },
      {
        logLevel: LogLevel.Fatal,
        expected: {
          isFatalEnabled: true,
          isErrorEnabled: false,
          isWarnEnabled: false,
          isInfoEnabled: false,
          isDebugEnabled: false,
          isTraceEnabled: false
        }
      },
      {
        logLevel: LogLevel.Error,
        expected: {
          isFatalEnabled: true,
          isErrorEnabled: true,
          isWarnEnabled: false,
          isInfoEnabled: false,
          isDebugEnabled: false,
          isTraceEnabled: false
        }
      },
      {
        logLevel: LogLevel.Warn,
        expected: {
          isFatalEnabled: true,
          isErrorEnabled: true,
          isWarnEnabled: true,
          isInfoEnabled: false,
          isDebugEnabled: false,
          isTraceEnabled: false
        }
      },
      {
        logLevel: LogLevel.Info,
        expected: {
          isFatalEnabled: true,
          isErrorEnabled: true,
          isWarnEnabled: true,
          isInfoEnabled: true,
          isDebugEnabled: false,
          isTraceEnabled: false
        }
      },
      {
        logLevel: LogLevel.Debug,
        expected: {
          isFatalEnabled: true,
          isErrorEnabled: true,
          isWarnEnabled: true,
          isInfoEnabled: true,
          isDebugEnabled: true,
          isTraceEnabled: false
        }
      },
      {
        logLevel: LogLevel.Trace,
        expected: {
          isFatalEnabled: true,
          isErrorEnabled: true,
          isWarnEnabled: true,
          isInfoEnabled: true,
          isDebugEnabled: true,
          isTraceEnabled: true
        }
      }
    ]

    it.each(cases)('logLevel=$logLevel', ({ logLevel, expected }) => {
      const actual = createLogger(logLevel)

      expect(actual.isFatalEnabled()).toBe(expected.isFatalEnabled)
      expect(actual.isErrorEnabled()).toBe(expected.isErrorEnabled)
      expect(actual.isWarnEnabled()).toBe(expected.isWarnEnabled)
      expect(actual.isInfoEnabled()).toBe(expected.isInfoEnabled)
      expect(actual.isDebugEnabled()).toBe(expected.isDebugEnabled)
      expect(actual.isTraceEnabled()).toBe(expected.isTraceEnabled)
    })
  })
})
