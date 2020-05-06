// to be tested
import * as languagesHelper from '@helpers/languages'

// to be mocked
import * as prompt from '@helpers/prompt'

// tools
import { POEditor } from '@lib/poeditor'
import { Language, ProjectLanguage } from '@models/poeditor'

// tools
import { checkAllMocksCalled } from '@test/tools'
import { mocked } from 'ts-jest/utils'

// mock inits
jest.mock('@helpers/prompt')

describe('helpers/languages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  describe('selectNewLanguages', () => {
    const languages: Language[] = [{
      name: 'Swenglish',
      code: 'sv'
    }]

    it('should select a language', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue(languages),
        mocked(prompt).selectCheckboxPlus.mockResolvedValue(languages)
      ]
      const uncalledMocks = [
        jest.spyOn(languagesHelper, 'filterLanguages')
      ]

      const output = await languagesHelper.selectNewLanguages(poe)

      expect(output).toEqual(languages)
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })

    it('should call exclude when exclude list is defined', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue(languages),
        mocked(prompt).selectCheckboxPlus.mockResolvedValue(languages),
        jest.spyOn(languagesHelper, 'filterLanguages').mockReturnValue(languages)
      ]
      const output = await languagesHelper.selectNewLanguages(poe, [])

      expect(output).toEqual(languages)
      checkAllMocksCalled(mocks, 1)
    })

    it('should return nothing when no languages are available', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue([])
      ]
      const uncalledMocks = [
        mocked(prompt).selectCheckboxPlus.mockResolvedValue(languages),
        jest.spyOn(languagesHelper, 'filterLanguages')
      ]

      const output = await languagesHelper.selectNewLanguages(poe)

      expect(output).toEqual(undefined)
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })
  })

  describe('filterLanguages', () => {
    it('should filter languages', () => {
      const languages: Language[] = [{
        name: 'Swedish',
        code: 'sv'
      }, {
        name: 'English',
        code: 'en'
      }, {
        name: 'Finnish',
        code: 'fi'
      }]

      const filters: ProjectLanguage[] = [{
        name: 'Danish',
        code: 'da',
        translations: 0,
        percentage: 0,
        updated: ''
      }, {
        name: 'English',
        code: 'en',
        translations: 0,
        percentage: 0,
        updated: ''
      }]

      const output = languagesHelper.filterLanguages(languages, filters)

      expect(output).toEqual([{
        name: 'Swedish',
        code: 'sv'
      }, {
        name: 'Finnish',
        code: 'fi'
      }])
    })
  })
})
