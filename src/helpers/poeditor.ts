import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, TermBase, Term, Contributor } from '@models/poeditor'
import { getConfirmation, mapToChoices, selectX, selectCheckboxPlus, promptInput, buildChoiceSourceFunction } from '@helpers/prompt'

/**
 * Forces the user to select a project
 * @param poe
 * POEditor instance
 */
export const selectProject = async (poe: POEditor): Promise<CompactProject | undefined> => {
  const projects = await poe.listProjects()

  if (!projects.length) {
    return
  }

  const choices = mapToChoices<CompactProject>(projects, getCompactProjectName)

  return selectX<CompactProject>(choices, 'Select project')
}

/**
 * Forces the user to select a language from a project. If no language is available nothing gets returned
 * @param poe
 * POEditor instance
 * @param id
 * Project id. For example 123456
 */
export const selectProjectLanguage = async (poe: POEditor, id: number, message: string = 'Select language'): Promise<ProjectLanguage | undefined> => {
  const languages = await poe.getProjectLanguages({ id })
  if (!languages.length) {
    return
  }

  const choices = mapToChoices<ProjectLanguage>(languages, getLanguageName)
  return selectX<ProjectLanguage>(choices, message)
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
 * Returns a contributor name for display in inquirer as a choice
 * @param contributor
 * Contributor object
 */
export const getContributorName = (contributor: Contributor) => {
  return `${contributor.name} ${contributor.email}`
}

/**
 * Returns a term name for display in inquirer as a choice
 * @param term
 * Term object
 */
export const getTermName = (term: Term) => {
  return term.context ? `${term.term} ${term.context}` : term.term
}

/**
 * Returns a project name for display in inquirer as a choice
 * @param project
 * Project object
 */
export const getCompactProjectName = (project: CompactProject) => {
  return `${project.name} - ${project.id}`
}

/**
 * Returns a project language for displayin in inquirer as a choice
 * @param language
 */
export const getLanguageName = (language: Language) => {
  return `${language.code} - ${language.name}`
}
