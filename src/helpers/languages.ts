import { POEditor } from '@lib/poeditor'
import { CompactProject, ProjectLanguage, Project, Language } from '@models/poeditor'
import { getLanguageName } from './poeditor'
import * as log from '@lib/log'
import { mapToChoices, selectAuto, buildChoiceSourceFunction, selectCheckboxPlus } from './prompt'
import { BooleanMap } from '@models/common'

/**
 * Gives the user the option to zero or more languages to a project
 * @param poe
 * POEditor instance
 * @param project
 * CompactProject
 * @param exclude
 * List of languages to exclude
 */
export const addLanguagesToProject = async (poe: POEditor, project: CompactProject, exclude?: ProjectLanguage[]): Promise<void> => {
  const languages = await selectNewLanguages(poe, exclude)
  if (!languages) {
    log.info('This project has no languages left to add')
    return
  }

  for (let i = 0; i < languages.length; i++) { // a basic for loop? Just making sure we don't hammer POEditor API
    await poe.addLanguage({ id: project.id, language: languages[i].code })
    log.info(`Successfully added ${languages[i].name} to ${project.name}`)
  }
}

/**
 * Forces the user to select languages to add from the list of all available languages
 * @param poe
 * POEditor instance
 * @param exclude
 * List of languages to exclude. Optional.
 */
export const selectNewLanguages = async (poe: POEditor, exclude?: ProjectLanguage[]): Promise<Language[] | undefined> => {
  let languages = await poe.getAvailableLanguages()
  if (exclude) {
    languages = filterLanguages(languages, exclude)
  }

  if (!languages.length) {
    return
  }

  const choices = mapToChoices<Language>(languages, getLanguageName)
  return selectCheckboxPlus<Language>('Select language(s) to add to your project', buildChoiceSourceFunction<Language>(choices))
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
 * Forces the user to set reference language for a fresh project
 * @param poe
 * @param project
 */
export const setReferenceLanguage = async (poe:POEditor, project: Project): Promise<void> => {
  const languages = await poe.getProjectLanguages({ id: project.id })
  if (!languages.length) {
    return
  }

  const choices = mapToChoices<ProjectLanguage>(languages, getLanguageName)
  const language = await selectAuto('Select reference language', buildChoiceSourceFunction<ProjectLanguage>(choices))

  await poe.updateProject({
    id: project.id,
    reference_language: language.code
  })
  log.info('Reference language updated')
}
