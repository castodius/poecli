// to be tested
import * as promptHelper from '@helpers/prompt'

// tools
import { stdin, MockSTDIN } from 'mock-stdin'

describe('prompt', () => {
  let stdinMock: MockSTDIN
  beforeEach(() => {
    stdinMock = stdin()
  })

  describe('getConfirmation', () => {
    it('should return true if user typed Y', async () => {
      process.nextTick(() => {
        stdinMock.send('Y')
        stdinMock.end()
      })

      const output = await promptHelper.getConfirmation('some text')

      expect(output).toEqual(true)
    })

    it('should return true if user typed n', async () => {
      process.nextTick(() => {
        stdinMock.send('n')
        stdinMock.end()
      })

      const output = await promptHelper.getConfirmation('some text')

      expect(output).toEqual(false)
    })
  })

  describe('mapToChoices', () => {
    interface TestStuff {
      a: string;
      b: number;
    }
    it('should map an array to choices', () => {
      const input: TestStuff[] = [
        {
          a: 'abc',
          b: 123
        }
      ]

      const output = promptHelper.mapToChoices<TestStuff>(input, (value: TestStuff) => { return value.a })

      expect(output).toEqual([{
        name: 'abc',
        value: input[0]
      }])
    })
  })
})
