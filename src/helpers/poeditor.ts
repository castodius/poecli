import * as inquirer from 'inquirer'
import * as checkbox from 'inquirer-checkbox-plus-prompt'

import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, TermBase, Term } from '@models/poeditor'
import { BooleanMap } from '@models/common'
inquirer.registerPrompt('checkbox-plus', checkbox)

interface ProjectChoice {
  name: string;
  value: CompactProject;
}

interface ProjectOutput {
  project: CompactProject;
}

/**
 * Forces the user to select a project
 * @param poe
 * POEditor instance
 */
export const selectProject = async (poe: POEditor): Promise<CompactProject> => {
  const projects = await poe.listProjects()

  const choices: ProjectChoice[] = mapProjectsToChoices(projects)
  const { project }: ProjectOutput = await inquirer.prompt([
    {
      name: 'project',
      type: 'list',
      message: 'Select project:',
      choices
    }
  ])

  return project
}

/**
 * Maps projects to choices usable by inquirer
 * @param projects
 * List of projects
 */
export const mapProjectsToChoices = (projects: CompactProject[]): ProjectChoice[] => {
  return projects.map((project: CompactProject): ProjectChoice => {
    return {
      name: `${project.name} - ${project.id}`,
      value: project
    }
  })
}

export interface LanguageChoice {
  name: string;
  value: Language;
}

export interface LanguageOutput {
  language: Language;
}

/**
 * Forces the user to select a language from the list of all available languages
 * @param poe
 * POEditor instance
 * @param exclude
 * List of languages to exclude. Optional.
 */
export const selectLanguage = async (poe: POEditor, exclude?: ProjectLanguage[]): Promise<Language> => {
  let languages = await poe.getAvailableLanguages()
  if (exclude) {
    languages = filterLanguages(languages, exclude)
  }

  const choices: LanguageChoice[] = mapLanguagesToChoices(languages)
  const { language }: LanguageOutput = await inquirer.prompt([
    {
      name: 'language',
      type: 'list',
      message: 'Select language:',
      choices
    }
  ])

  return language
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
 * Maps languages to inquirer format for choices
 * @param languages
 * Languages to map
 */
export const mapLanguagesToChoices = (languages: Language[]): LanguageChoice[] => {
  return languages.map((language: Language): LanguageChoice => {
    return {
      name: `${language.name} - ${language.code}`,
      value: language
    }
  })
}

export interface ProjectLanguageOutput {
  language: ProjectLanguage;
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

  const choices: LanguageChoice[] = mapLanguagesToChoices(languages)
  const { language }: ProjectLanguageOutput = await inquirer.prompt([
    {
      name: 'language',
      type: 'list',
      message: 'Select language:',
      choices
    }
  ])

  return language
}

/**
 * Forces the user to input at least one POEditor term.
 * Can be used to input as many terms as the user want.
 */
export const inputTerms = async (): Promise<TermBase[]> => {
  const terms: TermBase[] = []

  let anotherTerm = true

  while (anotherTerm) {
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

    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Do you want to add another term?'
      }
    ])

    anotherTerm = confirm
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

interface TermChoice {
  name: string;
  value: Term;
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

  const choices = mapTermsToChoices(availableTerms)

  const { terms }: { terms: Term[]} = await inquirer.prompt([
    {
      name: 'terms',
      type: 'checkbox-plus',
      message: 'Select terms for which you want to add comments',
      source: async (_: string, input: string) => {
        if (!input) {
          return choices
        }
        return choices.filter((choice: TermChoice): boolean => {
          return choice.name.includes(input)
        })
      }
    }
  ])

  return terms
}

/**
 * Maps terms to inquirer format choices
 * @param terms
 * Terms to map
 */
export const mapTermsToChoices = (terms: Term[]): TermChoice[] => {
  return terms.map((term: Term): TermChoice => {
    return {
      name: `${term.term} ${term.context}`,
      value: term
    }
  })
}
