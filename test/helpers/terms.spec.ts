// to be tested
import * as termsHelper from '@helpers/terms'

// to be mocked
import * as prompt from '@helpers/prompt'

// tools
import { POEditor } from '@lib/poeditor'
import { Term, TermBase } from '@models/poeditor'

// tools
import { checkAllMocksCalled } from '@test/tools'
import { mocked } from 'ts-jest/utils'

// mock inits
jest.mock('@helpers/prompt')

describe('helpers/terms', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
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
        jest.spyOn(termsHelper, 'inputTags').mockResolvedValue(['tags!']),
        mocked(prompt).getConfirmation.mockResolvedValue(false)
      ]

      const output = await termsHelper.inputTerms()

      expect(output).toHaveLength(1)
      checkOutput(output[0])
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled([promptMock], 5)
    })

    it('should be possible to input multiple terms', async () => {
      const promptMock = mocked(prompt).promptInput
      setResponseSequence(3, promptMock)
      const mocks = [
        jest.spyOn(termsHelper, 'inputTags').mockResolvedValue(['tags!']),
        mocked(prompt).getConfirmation
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false)
      ]

      const output = await termsHelper.inputTerms()

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
        const output = termsHelper.validateTerm(value)

        expect(output).toEqual(true)
      })
    })

    it('should reject empty value', () => {
      const output = termsHelper.validateTerm('')

      expect(typeof output).toEqual('string')
    })

    it('should reject just spaces', () => {
      const output = termsHelper.validateTerm('     ')

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

      const output = await termsHelper.inputTags()

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

      const output = await termsHelper.inputTags()

      expect(output).toEqual(['tag', 'tag', 'tag'])
      checkAllMocksCalled(mocks, 4)
    })

    it('should be possible to input no tags', async () => {
      const mocks = [
        mocked(prompt).promptInput
          .mockResolvedValueOnce('')
      ]

      const output = await termsHelper.inputTags()

      expect(output).toEqual([])
      checkAllMocksCalled(mocks, 1)
    })
  })

  describe('validateTag', () => {
    it('should accept good input', () => {
      ['abc', 'payments', 'my-tag'].forEach((tag: string) => {
        const output = termsHelper.validateTag(tag)

        expect(output).toEqual(true)
      })
    })

    it('should accept empty input', () => {
      const output = termsHelper.validateTag('')

      expect(output).toEqual(true)
    })

    it('should reject bad input', () => {
      ['two words', 'a lot of words', 'ohno,,,'].forEach((tag: string) => {
        const output = termsHelper.validateTag(tag)

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

      const output = await termsHelper.multiSelectTerms(poe, 123456)

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

      const output = await termsHelper.multiSelectTerms(poe, 123456)

      expect(output).toEqual([])
      checkAllMocksCalled(mocks, 1)
      checkAllMocksCalled(uncalledMocks, 0)
    })
  })
})
