// to be tested
import * as poeditorHelper from '@helpers/poeditor'

// tools
import { stdin, MockSTDIN } from 'mock-stdin'
import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage } from '@models/poeditor'

// models

describe('poeditor', () => {
  let stdinMock: MockSTDIN
  beforeEach(() => {
    stdinMock = stdin()
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
      jest.spyOn(poe, 'listProjects').mockResolvedValue(projects)

      process.nextTick(() => {
        stdinMock.send('\r')
      })
      const output = await poeditorHelper.selectProject(poe)

      expect(output).toEqual(projects[0])
    })

    it('should handle no projects being available', async () => {
      const poe = new POEditor('abc')
      jest.spyOn(poe, 'listProjects').mockResolvedValue([])

      const output = await poeditorHelper.selectProject(poe)

      expect(output).toEqual(undefined)
    })
  })

  describe('selectProject', () => {
    const languages: Language[] = [{
      name: 'Swenglish',
      code: 'sv'
    }]

    it('should select a language', async () => {
      const poe = new POEditor('abc')
      jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue(languages)
      const excludeSpy = jest.spyOn(poeditorHelper, 'filterLanguages')

      process.nextTick(() => {
        stdinMock.send('\r')
      })
      const output = await poeditorHelper.selectLanguage(poe)

      expect(output).toEqual(languages[0])
      expect(excludeSpy.mock.calls.length).toEqual(0)
      excludeSpy.mockRestore()
    })

    it('should call exclude when exclude list is defined', async () => {
      const poe = new POEditor('abc')
      jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue(languages)
      const excludeSpy = jest.spyOn(poeditorHelper, 'filterLanguages').mockReturnValue(languages)

      process.nextTick(() => {
        stdinMock.send('\r')
      })
      const output = await poeditorHelper.selectLanguage(poe, [])

      expect(output).toEqual(languages[0])
      expect(excludeSpy.mock.calls.length).toEqual(1)
      excludeSpy.mockRestore()
    })

    it('should return nothing when no languages are available', async () => {
      const poe = new POEditor('abc')
      jest.spyOn(poe, 'getAvailableLanguages').mockResolvedValue([])
      const excludeSpy = jest.spyOn(poeditorHelper, 'filterLanguages')

      process.nextTick(() => {
        stdinMock.send('\r')
      })
      const output = await poeditorHelper.selectLanguage(poe)

      expect(output).toEqual(undefined)
      expect(excludeSpy.mock.calls.length).toEqual(0)
      excludeSpy.mockRestore()
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
})
