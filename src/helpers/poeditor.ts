import * as inquirer from 'inquirer'

import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, TermBase } from '@models/poeditor'
import { BooleanMap } from '@models/common'

interface ProjectChoice {
  name: string;
  value: CompactProject;
}

interface ProjectOutput {
  project: CompactProject;
}

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

export const filterLanguages = (languages: Language[], filters: ProjectLanguage[]): Language[] => {
  const filterMap: BooleanMap = filters.reduce((acc: BooleanMap, language: ProjectLanguage) => {
    acc[language.code] = true
    return acc
  }, {})

  return languages.filter((language: Language) => {
    return !filterMap[language.code]
  })
}

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
        name: 'comment',
        type: 'input',
        message: 'Input comment (optional)'
      },
      {
        name: 'context',
        type: 'input',
        message: 'Input context (optional)'
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

export const validateTerm = (value: string) => {
  if (!value && !value.trim()) {
    return 'Please input a term such as "PROJECT_NAME"'
  }

  return true
}

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

export const validateTag = (value: string) => {
  if (!value) {
    return true
  }

  if (!value.match(/^[^,\s]+$/)) {
    return 'Input should be a string without whitespace. For example "abc" or "my-tag"'
  }

  return true
}
