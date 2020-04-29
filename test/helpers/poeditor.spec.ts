// to be tested
import * as poeditorHelper from '@helpers/poeditor'

// tools
import { stdin, MockSTDIN } from 'mock-stdin'
import { POEditor } from '@lib/poeditor'
import { CompactProject } from '@models/poeditor'

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
})
