import { createLogger } from './createLogger'
import { LogLevel } from './LogLevel'

describe('createLogger', () => {
  describe('returns new Logger instance', () => {
    interface TestCase {
      logLevel: LogLevel
      isFatalEnabled: boolean
      isErrorEnabled: boolean
      isWarnEnabled: boolean
      isInfoEnabled: boolean
      isDebugEnabled: boolean
      isTraceEnabled: boolean
    }
    const cases: TestCase[] = [
      {
        logLevel: LogLevel.Off,
        isFatalEnabled: false,
        isErrorEnabled: false,
        isWarnEnabled: false,
        isInfoEnabled: false,
        isDebugEnabled: false,
        isTraceEnabled: false
      },
      {
        logLevel: LogLevel.Fatal,
        isFatalEnabled: true,
        isErrorEnabled: false,
        isWarnEnabled: false,
        isInfoEnabled: false,
        isDebugEnabled: false,
        isTraceEnabled: false
      },
      {
        logLevel: LogLevel.Error,
        isFatalEnabled: true,
        isErrorEnabled: true,
        isWarnEnabled: false,
        isInfoEnabled: false,
        isDebugEnabled: false,
        isTraceEnabled: false
      },
      {
        logLevel: LogLevel.Warn,
        isFatalEnabled: true,
        isErrorEnabled: true,
        isWarnEnabled: true,
        isInfoEnabled: false,
        isDebugEnabled: false,
        isTraceEnabled: false
      },
      {
        logLevel: LogLevel.Info,
        isFatalEnabled: true,
        isErrorEnabled: true,
        isWarnEnabled: true,
        isInfoEnabled: true,
        isDebugEnabled: false,
        isTraceEnabled: false
      },
      {
        logLevel: LogLevel.Debug,
        isFatalEnabled: true,
        isErrorEnabled: true,
        isWarnEnabled: true,
        isInfoEnabled: true,
        isDebugEnabled: true,
        isTraceEnabled: false
      },
      {
        logLevel: LogLevel.Trace,
        isFatalEnabled: true,
        isErrorEnabled: true,
        isWarnEnabled: true,
        isInfoEnabled: true,
        isDebugEnabled: true,
        isTraceEnabled: true
      }
    ]

    it.each<TestCase>(cases)('logLevel=$logLevel', ({
      logLevel,
      isFatalEnabled,
      isErrorEnabled,
      isWarnEnabled,
      isInfoEnabled,
      isDebugEnabled,
      isTraceEnabled
    }) => {
      const logger = createLogger(logLevel)
      expect(logger.isFatalEnabled()).toBe(isFatalEnabled)
      expect(logger.isErrorEnabled()).toBe(isErrorEnabled)
      expect(logger.isWarnEnabled()).toBe(isWarnEnabled)
      expect(logger.isInfoEnabled()).toBe(isInfoEnabled)
      expect(logger.isDebugEnabled()).toBe(isDebugEnabled)
      expect(logger.isTraceEnabled()).toBe(isTraceEnabled)
    })
  })
})
