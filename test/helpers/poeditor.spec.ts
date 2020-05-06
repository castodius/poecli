// to be tested
import * as poeditorHelper from '@helpers/poeditor'

// to be mocked
import * as prompt from '@helpers/prompt'

// tools
import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, Term, Contributor } from '@models/poeditor'

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
