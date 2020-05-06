import { TermBase, Term, CompactProject, UpdateStatisticsObject } from '@models/poeditor'
import { promptInput, getConfirmation, mapToChoices, selectCheckboxPlus, buildChoiceSourceFunction } from './prompt'
import { POEditor } from '@lib/poeditor'
import { getTermName } from './poeditor'

/**
 * Forces a user to manually add at least one term to a project
 * @param poe
 * POEditor instance
 * @param project
 * Compact project
 */
export const addTerms = async (poe: POEditor, project: CompactProject): Promise<UpdateStatisticsObject> => {
  const terms: TermBase[] = await inputTerms()

  return poe.addTerms({ id: project.id, terms })
}

/**
 * Forces the user to input at least one POEditor term.
 * Can be used to input as many terms as the user want.
 */
export const inputTerms = async (): Promise<TermBase[]> => {
  const terms: TermBase[] = []

  while (true) {
    const termText = await promptInput('Input term', '', validateTerm)
    const context = await promptInput('Input context (optional)', '')
    const comment = await promptInput('Input comment (optional)', '')
    const reference = await promptInput('Input reference (optional)', '')
    const plural = await promptInput('Input plural (optional)', '')

    const tags = await inputTags()

    const term: TermBase = {
      term: termText,
      context,
      comment,
      reference,
      plural,
      tags
    }
    terms.push(term)

    const confirm = await getConfirmation('Do you want to add another term?')
    if (!confirm) {
      break
    }
  }

  return terms
}

/**
 * Forces the user to select one or more terms
 * @param poe
 * POEditor instance
 * @param id
 * Project id. For example 123456
 */
export const multiSelectTerms = async (poe: POEditor, id: number): Promise<Term[]> => {
  const availableTerms: Term[] = await poe.listTerms({ id })
  if (!availableTerms.length) {
    return []
  }

  const choices = mapToChoices<Term>(availableTerms, getTermName)

  const terms: Term[] = await selectCheckboxPlus<Term>('Select terms for which you want to add comments', buildChoiceSourceFunction<Term>(choices))

  return terms
}

/**
 * Checks that a term has a proper value.
 * @param value
 * String which should be validated.
 */
export const validateTerm = (value: string) => {
  if (!value || !value.trim()) {
    return 'Please input a term such as "PROJECT_NAME"'
  }

  return true
}

/**
 * Forces the user to input at least one POEditor tag.
 */
export const inputTags = async (): Promise<string[]> => {
  const tags: string[] = []
  while (true) {
    const tag = await promptInput('Input tag(s). Enter an empty string to continue with the next step', '', validateTag)

    if (!tag) {
      break
    }
    tags.push(tag)
  }

  return tags
}

/**
 * Validates the format of a tag
 * @param value
 * Value to validate
 */
export const validateTag = (value: string) => {
  if (!value) {
    return true
  }

  if (!value.match(/^[^,\s]+$/)) {
    return 'Input should be a string without whitespace. For example "abc" or "my-tag"'
  }

  return true
}
