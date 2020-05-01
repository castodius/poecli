import * as inquirer from 'inquirer'

import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, TermBase, Term, Contributor } from '@models/poeditor'
import { BooleanMap } from '@models/common'
import { getConfirmation, mapToChoices, Choice, selectX, selectCheckboxPlus } from '@helpers/prompt'

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
 * Forces the user to select a language from the list of all available languages
 * @param poe
 * POEditor instance
 * @param exclude
 * List of languages to exclude. Optional.
 */
export const selectLanguage = async (poe: POEditor, exclude?: ProjectLanguage[]): Promise<Language | undefined> => {
  let languages = await poe.getAvailableLanguages()
  if (exclude) {
    languages = filterLanguages(languages, exclude)
  }

  if (!languages.length) {
    return
  }

  const choices = mapToChoices<Language>(languages, getLanguageName)
  return selectX<Language>(choices, 'Select language')
}

/**
 * Removes list of languages to exclude from another list
 * @param languages
 * Languages from which to filter
 * @param filters
 * Filters
 */
export const filterLanguages = (languages: Language[], filters: ProjectLanguage[]): Language[] => {
  const filterMap: BooleanMap = filters.reduce((acc: BooleanMap, language: ProjectLanguage) => {
    acc[language.code] = true
    return acc
  }, {})

  return languages.filter((language: Language) => {
    return !filterMap[language.code]
  })
}

/**
 * Forces the user to select a language from a project. If no language is available nothing gets returned
 * @param poe
 * POEditor instance
 * @param id
 * Project id. For example 123456
 */
export const selectProjectLanguage = async (poe: POEditor, id: number): Promise<ProjectLanguage | undefined> => {
  const languages = await poe.getProjectLanguages({ id })
  if (!languages.length) {
    return
  }

  const choices = mapToChoices<ProjectLanguage>(languages, getLanguageName)
  return selectX<ProjectLanguage>(choices, 'Select language')
}

/**
 * Forces the user to input at least one POEditor term.
 * Can be used to input as many terms as the user want.
 */
export const inputTerms = async (): Promise<TermBase[]> => {
  const terms: TermBase[] = []

  while (true) {
    const partialTerm: TermBase = await inquirer.prompt([
      {
        name: 'term',
        type: 'input',
        message: 'Input term',
        validate: validateTerm
      },
      {
        name: 'context',
        type: 'input',
        message: 'Input context (optional)'
      },
      {
        name: 'comment',
        type: 'input',
        message: 'Input comment (optional)'
      },
      {
        name: 'reference',
        type: 'input',
        message: 'Input reference (optional)'
      },
      {
        name: 'plural',
        type: 'input',
        message: 'Input plural (optional)'
      }
    ])

    const tags = await inputTags()

    const term: TermBase = {
      ...partialTerm,
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
  if (!value && !value.trim()) {
    return 'Please input a term such as "PROJECT_NAME"'
  }

  return true
}

/**
 * Forces the user to input at least one POEditor tag.
 */
export const inputTags = async (): Promise<string[]> => {
  const tags: string[] = []
  let tag: string = 'something'
  while (tag) {
    const { newTag }: { newTag: string } = await inquirer.prompt([
      {
        name: 'newTag',
        type: 'input',
        message: 'Input tag(s). Enter an empty string to continue with the next step',
        validate: validateTag
      }
    ])

    if (newTag) {
      tags.push(newTag)
    }
    tag = newTag
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

  const terms: Term[] = await selectCheckboxPlus<Term>('Select terms for which you want to add comments', buildTermSourceFunction(choices))

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
  return `${language.name} - ${language.code}`
}

/**
 * Creates an inquirer autocomplete source function
 * @param choices
 * Choices to be used in function
 */
export const buildContributorSourceFunction = (choices: Choice<Contributor>[]): (_ : string, input: string) => Promise<Choice<Contributor>[]> => {
  return async (_: string, input: string): Promise<Choice<Contributor>[]> => {
    if (!input) {
      return choices
    }
    return choices.filter((choice: Choice<Contributor>): boolean => {
      return choice.name.includes(input)
    })
  }
}

/**
 * Creates an inquirer autocomplete source function
 * @param choices
 * Choices to be used in function
 */
export const buildTermSourceFunction = (choices: Choice<Term>[]): (_ : string, input: string) => Promise<Choice<Term>[]> => {
  return async (_: string, input: string): Promise<Choice<Term>[]> => {
    if (!input) {
      return choices
    }
    return choices.filter((choice: Choice<Term>): boolean => {
      return choice.name.includes(input)
    })
  }
}
