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

export const inputTerms = async (poe: POEditor): Promise<TermBase[]> => {
  /**
 * "term": "one project found",
        "context": "",
        "reference": "\/projects",
        "plural": "%d projects found",
        "comment": "Make sure you translate the plural forms",
        "tags": [
            "first_tag",
            "second_tag"
        ]
 */
  return []
}

interface TagOutput {
  newTag: string;
}
export const inputTags = async (): Promise<string[]> => {
  const tags: string[] = []
  let tag: string = 'something'
  while (tag) {
    const { newTag }: TagOutput = await inquirer.prompt([
      {
        name: 'newTag',
        type: 'input',
        message: 'Input tags. Enter an empty string to continue with the next step',
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
