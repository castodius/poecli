import * as inquirer from 'inquirer'

import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage } from '@models/poeditor'
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
