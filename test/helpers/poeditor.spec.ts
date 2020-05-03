// to be tested
import * as poeditorHelper from '@helpers/poeditor'

// to be mocked
import * as prompt from '@helpers/prompt'

// tools
import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, TermBase } from '@models/poeditor'

// tools
import { checkAllMocksCalled } from '@test/tools'
import { mocked } from 'ts-jest/utils'

// mock inits
jest.mock('@helpers/prompt')

describe('poeditor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('selectProject', () => {
    const projects: CompactProject[] = [{
      id: 123,
      name: 'abc',
      created: 'some date',
      public: 0,
      open: 0
    }]

    it('should be able to select a project', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'listProjects').mockResolvedValue(projects),
        mocked(prompt).selectX.mockResolvedValue(projects[0])
      ]

      const output = await poeditorHelper.selectProject(poe)

      expect(output).toEqual(projects[0])
      checkAllMocksCalled(mocks, 1)
    })

    it('should return nothing if no projects were found', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'listProjects').mockResolvedValue([])
      ]
      const uncalledMocks = [
        mocked(prompt).selectX.mockResolvedValue(projects[0])
      ]

      const output = await poeditorHelper.selectProject(poe)

      expect(output).toEqual(undefined)
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })
  })

  describe('selectProject', () => {
    const languages: Language[] = [{
      name: 'Swenglish',
      code: 'sv'
    }]

    it('should select a language', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue(languages),
        mocked(prompt).selectAuto.mockResolvedValue(languages[0])
      ]
      const uncalledMocks = [
        jest.spyOn(poeditorHelper, 'filterLanguages')
      ]

      const output = await poeditorHelper.selectLanguage(poe)

      expect(output).toEqual(languages[0])
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })

    it('should call exclude when exclude list is defined', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue(languages),
        mocked(prompt).selectAuto.mockResolvedValue(languages[0]),
        jest.spyOn(poeditorHelper, 'filterLanguages').mockReturnValue(languages)
      ]
      const output = await poeditorHelper.selectLanguage(poe, [])

      expect(output).toEqual(languages[0])
      checkAllMocksCalled(mocks, 1)
    })

    it('should return nothing when no languages are available', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue([])
      ]
      const uncalledMocks = [
        mocked(prompt).selectAuto.mockResolvedValue(languages[0]),
        jest.spyOn(poeditorHelper, 'filterLanguages')
      ]

      const output = await poeditorHelper.selectLanguage(poe)

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

      const output = poeditorHelper.filterLanguages(languages, filters)

      expect(output).toEqual([{
        name: 'Swedish',
        code: 'sv'
      }, {
        name: 'Finnish',
        code: 'fi'
      }])
    })
  })

  describe('selectProjectLanguage', () => {
    const languages: ProjectLanguage[] = [{
      name: 'Swedish',
      code: 'sv',
      translations: 0,
      percentage: 0,
      updated: 'some date'
    }]

    it('should be possible to select project language', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getProjectLanguages').mockResolvedValue(languages),
        mocked(prompt).selectX.mockResolvedValue(languages[0])
      ]

      const output = await poeditorHelper.selectProjectLanguage(poe, 123456)

      expect(output).toEqual(languages[0])
      checkAllMocksCalled(mocks, 1)
    })

    it('should be return nothing if no languages are available', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'getProjectLanguages').mockResolvedValue([])
      ]
      const uncalledMocks = [
        mocked(prompt).selectX.mockResolvedValue(languages[0])
      ]

      const output = await poeditorHelper.selectProjectLanguage(poe, 123456)

      expect(output).toEqual(undefined)
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })
  })

  describe('inputTerms', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setResponseSequence = (times: number, mock: any) => {
      for (let i = 0; i < times; i++) {
        mock.mockResolvedValueOnce('term')
        mock.mockResolvedValueOnce('context')
        mock.mockResolvedValueOnce('comment')
        mock.mockResolvedValueOnce('reference')
        mock.mockResolvedValueOnce('plural')
      }
    }

    const checkOutput = (output: TermBase) => {
      expect(output).toEqual({
        term: 'term',
        context: 'context',
        comment: 'comment',
        reference: 'reference',
        plural: 'plural',
        tags: ['tags!']
      })
    }
    it('should be possible to input one term', async () => {
      const promptMock = mocked(prompt).promptInput
      setResponseSequence(1, promptMock)
      const mocks = [
        jest.spyOn(poeditorHelper, 'inputTags').mockResolvedValue(['tags!']),
        mocked(prompt).getConfirmation.mockResolvedValue(false)
      ]

      const output = await poeditorHelper.inputTerms()

      expect(output).toHaveLength(1)
      checkOutput(output[0])
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled([promptMock], 5)
    })

    it('should be possible to input multiple terms', async () => {
      const promptMock = mocked(prompt).promptInput
      setResponseSequence(3, promptMock)
      const mocks = [
        jest.spyOn(poeditorHelper, 'inputTags').mockResolvedValue(['tags!']),
        mocked(prompt).getConfirmation
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false)
      ]

      const output = await poeditorHelper.inputTerms()

      expect(output).toHaveLength(3)
      output.forEach((value: TermBase) => {
        checkOutput(value)
      })
      checkAllMocksCalled(mocks, 3)
      checkAllMocksCalled([promptMock], 15)
    })
  })
})
