// to be tested
import * as setToken from '@actions/token/set'

// to be mocked
import * as prompt from '@helpers/prompt'
import * as config from '@helpers/config'
import { POEditor } from '@lib/poeditor'

// tools

// tools
import { checkAllMocksCalled } from '@test/tools'
import { mocked } from 'ts-jest/utils'

// mock inits
jest.mock('@lib/poeditor')
jest.mock('@helpers/prompt')
jest.mock('@helpers/config')
jest.mock('@lib/log')

describe('set', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  describe('set', () => {
    it('should get and set token', async () => {
      const token = 'token123'
      const setTokenMock = mocked(config).setToken
      const mocks = [
        jest.spyOn(setToken, 'getToken').mockResolvedValue(token),
        setTokenMock
      ]

      await setToken.set()

      expect(setTokenMock.mock.calls[0][0]).toEqual(token)
      checkAllMocksCalled(mocks, 1)
    })
  })

  describe('getToken', () => {
    it('should get a token', async () => {
      const token = 'token123'
      const mocks = [
        mocked(prompt).promptInput.mockResolvedValue(token),
        jest.spyOn(setToken, 'verifyToken').mockResolvedValue(true)
      ]

      const output = await setToken.getToken()

      expect(output).toEqual(token)
      checkAllMocksCalled(mocks, 1)
    })

    it('should handle multiple attempts to get a token', async () => {
      const token = 'token123'
      const mocks = [
        mocked(prompt).promptInput.mockResolvedValue(token),
        jest.spyOn(setToken, 'verifyToken')
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(false)
          .mockResolvedValue(true)
      ]

      const output = await setToken.getToken()

      expect(output).toEqual(token)
      checkAllMocksCalled(mocks, 3)
    })
  })

  describe('verifyToken', () => {
    it('should return if the token is good', async () => {
      mocked(POEditor).mockImplementation((_?: string) => {
        return {
          listProjects: async () => {

          }
        } as unknown as POEditor
      })

      const output = await setToken.verifyToken('token')

      expect(output).toEqual(true)
    })

    it('should return false if the token is bad', async () => {
      mocked(POEditor).mockImplementation((_?: string) => {
        return {
          listProjects: async () => {
            throw new Error('Banana error')
          }
        } as unknown as POEditor
      })

      const output = await setToken.verifyToken('token')

      expect(output).toEqual(false)
    })
  })

  describe('validate', () => {
    it('should accept a good value', () => {
      const output = setToken.validate('abcdef12345678901234567890123456')

      expect(output).toEqual(true)
    })

    it('should reject values containing invalid characters', () => {
      const output = setToken.validate('xyzdef12345678901234567890123456')

      expect(output).toEqual('Please input a token consisting of numbers and the letters a through f')
    })

    it('should reject values that are too short or long', () => {
      ['abc', '3476218742719842169846148712648721648124618', 'abcdef123456789012345678901234567890', 'def']
        .forEach((value: string) => {
          const output = setToken.validate(value)

          expect(output).toEqual('Please input a token of length 32 (POEditor standard)')
        })
    })
  })
})
