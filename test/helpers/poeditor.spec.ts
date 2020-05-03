// to be tested
import * as poeditorHelper from '@helpers/poeditor'

// to be mocked
import * as prompt from '@helpers/prompt'

// tools
import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, TermBase, Term, Contributor } from '@models/poeditor'

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

  describe('validateTerm', () => {
    it('should accept defined values', () => {
      ['abc', 'MY_TERM', 'MY TERM'].forEach((value: string) => {
        const output = poeditorHelper.validateTerm(value)

        expect(output).toEqual(true)
      })
    })

    it('should reject empty value', () => {
      const output = poeditorHelper.validateTerm('')

      expect(typeof output).toEqual('string')
    })

    it('should reject just spaces', () => {
      const output = poeditorHelper.validateTerm('     ')

      expect(typeof output).toEqual('string')
    })
  })

  describe('inputTags', () => {
    it('should be possible to input one tag', async () => {
      const mocks = [
        mocked(prompt).promptInput
          .mockResolvedValueOnce('tag')
          .mockResolvedValueOnce('')
      ]

      const output = await poeditorHelper.inputTags()

      expect(output).toEqual(['tag'])
      checkAllMocksCalled(mocks, 2)
    })

    it('should be possible to input several tags', async () => {
      const mocks = [
        mocked(prompt).promptInput
          .mockResolvedValueOnce('tag')
          .mockResolvedValueOnce('tag')
          .mockResolvedValueOnce('tag')
          .mockResolvedValueOnce('')
      ]

      const output = await poeditorHelper.inputTags()

      expect(output).toEqual(['tag', 'tag', 'tag'])
      checkAllMocksCalled(mocks, 4)
    })

    it('should be possible to input no tags', async () => {
      const mocks = [
        mocked(prompt).promptInput
          .mockResolvedValueOnce('')
      ]

      const output = await poeditorHelper.inputTags()

      expect(output).toEqual([])
      checkAllMocksCalled(mocks, 1)
    })
  })

  describe('validateTag', () => {
    it('should accept good input', () => {
      ['abc', 'payments', 'my-tag'].forEach((tag: string) => {
        const output = poeditorHelper.validateTag(tag)

        expect(output).toEqual(true)
      })
    })

    it('should accept empty input', () => {
      const output = poeditorHelper.validateTag('')

      expect(output).toEqual(true)
    })

    it('should reject bad input', () => {
      ['two words', 'a lot of words', 'ohno,,,'].forEach((tag: string) => {
        const output = poeditorHelper.validateTag(tag)

        expect(typeof output).toEqual('string')
      })
    })
  })

  describe('multiSelectTerms', () => {
    const terms: Term[] = [{
      created: '',
      updated: '',
      translation: {
        content: '',
        fuzzy: 0,
        proofread: 0,
        updated: ''
      },
      term: 'term',
      context: 'context'
    }]
    it('should be able to select terms', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'listTerms').mockResolvedValue(terms),
        mocked(prompt).selectCheckboxPlus.mockResolvedValue(terms)
      ]

      const output = await poeditorHelper.multiSelectTerms(poe, 123456)

      expect(output).toEqual(terms)
      checkAllMocksCalled(mocks, 1)
    })

    it('should return nothing if the project has no terms', async () => {
      const poe = new POEditor('abc')
      const mocks = [
        jest.spyOn(poe, 'listTerms').mockResolvedValue([])
      ]
      const uncalledMocks = [
        mocked(prompt).selectCheckboxPlus.mockResolvedValue(terms)
      ]

      const output = await poeditorHelper.multiSelectTerms(poe, 123456)

      expect(output).toEqual([])
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })
  })

  describe('getContributorName', () => {
    it('should return name+email', () => {
      const contributor: Contributor = {
        name: 'Testman',
        email: 'testman@testgroup.com',
        permissions: []
      }

      const output = poeditorHelper.getContributorName(contributor)

      expect(output).toEqual('Testman testman@testgroup.com')
    })
  })

  describe('getTermName', () => {
    const getTerm = (): Term => {
      return {
        term: 'Some term',
        context: 'Much context',
        created: '',
        updated: '',
        translation: {
          updated: '',
          fuzzy: 0,
          proofread: 0,
          content: ''
        }
      }
    }

    it('should use term and context if context is defined', () => {
      const output = poeditorHelper.getTermName(getTerm())

      expect(output).toEqual('Some term Much context')
    })

    it('should only use term if context is not defined', () => {
      const term: Term = getTerm()
      delete term.context
      const output = poeditorHelper.getTermName(term)

      expect(output).toEqual('Some term')
    })
  })

  describe('getCompactProjectName', () => {
    it('should return name and id', () => {
      const project: CompactProject = {
        name: 'My project',
        id: 123456,
        public: 0,
        open: 0,
        created: 'yes'
      }

      const output = poeditorHelper.getCompactProjectName(project)

      expect(output).toEqual('My project - 123456')
    })
  })

  describe('getLanguageName', () => {
    it('should return name and code', () => {
      const language: Language = {
        name: 'My lang',
        code: 'ok'
      }

      const output = poeditorHelper.getLanguageName(language)

      expect(output).toEqual('ok - My lang')
    })
  })
})
