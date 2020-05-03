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

    it('should return false if user typed n', async () => {
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

  describe('selectX', () => {
    it('should be able to select an item from a list', async () => {
      process.nextTick(() => {
        stdinMock.send('\r')
      })
      const choices = promptHelper.mapToChoices<string>(['abc', 'def'], (item: string) => item)

      const output = await promptHelper.selectX(choices, 'some text')

      expect(output).toEqual('abc')
    })
  })

  describe('selectAuto', () => {
    /**
     * Yes, I wanted to test d followed by carriage return here. Could not get it to work
     */
    it('should be able to select an item using autocomplete', async () => {
      process.nextTick(() => {
        stdinMock.send('\r')
      })

      const output = await promptHelper.selectAuto<string>('some text', promptHelper.buildStringSourceFunction(['abc', 'def']))

      expect(output).toEqual('abc')
    })
  })

  describe('selectCheckboxPlus', () => {
    it('should be able to select an item using checkbox plus', async () => {
      process.nextTick(() => {
        stdinMock.send(' \r')
      })

      const output = await promptHelper.selectCheckboxPlus<string>('some text', promptHelper.buildStringSourceFunction(['abc', 'def']))

      expect(output).toEqual(['abc'])
    })
  })

  describe('promptInput', () => {
    it('should return input from user', async () => {
      process.nextTick(() => {
        stdinMock.send('abc')
        stdinMock.send('\r')
      })

      const output = await promptHelper.promptInput('write something')

      expect(output).toEqual('abc')
    })

    it('should use default', async () => {
      process.nextTick(() => {
        stdinMock.send('\r')
      })

      const output = await promptHelper.promptInput('write something', 'so basic')

      expect(output).toEqual('so basic')
    })
  })

  describe('buildStringSourceFunction', () => {
    it('should return a source function', async () => {
      const choices = ['abc', 'def', 'ad']
      const foo = promptHelper.buildStringSourceFunction(choices)

      const all = await foo('', '')
      expect(all).toEqual(choices)

      const onlyA = await foo('', 'a')
      expect(onlyA).toEqual(['abc', 'ad'])

      const onlyD = await foo('', 'd')
      expect(onlyD).toEqual(['def', 'ad'])

      const nothing = await foo('', 'banana')
      expect(nothing).toEqual([])
    })
  })

  describe('buildChoiceSourceFunction', () => {
    it('should return a source function', async () => {
      const choices = promptHelper.mapToChoices<string>(['abc', 'def', 'ad'], item => item)
      const foo = promptHelper.buildChoiceSourceFunction(choices)

      const all = await foo('', '')
      expect(all).toEqual(choices)

      const onlyA = await foo('', 'a')
      expect(onlyA).toEqual([choices[0], choices[2]])

      const onlyD = await foo('', 'd')
      expect(onlyD).toEqual([choices[1], choices[2]])

      const nothing = await foo('', 'banana')
      expect(nothing).toEqual([])
    })
  })
})
