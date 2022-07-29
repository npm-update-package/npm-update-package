import { main } from '../main'
import {
  initOptions,
  type Options
} from '../options'

jest.mock('../main')
jest.mock('../options')

describe('npm-update-package', () => {
  const mainMock = jest.mocked(main)
  const initOptionsMock = jest.mocked(initOptions)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('runs main()', async () => {
    const options = {} as unknown as Options
    initOptionsMock.mockReturnValue(options)
    mainMock.mockResolvedValue()

    await import('./npm-update-package')

    expect(initOptionsMock).toBeCalledWith()
    expect(mainMock).toBeCalledWith(options)
  })
})
