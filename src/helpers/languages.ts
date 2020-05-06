import { POEditor } from '@lib/poeditor'
import { CompactProject, ProjectLanguage, Project } from '@models/poeditor'
import { selectNewLanguages, getLanguageName } from './poeditor'
import * as log from '@lib/log'
import { mapToChoices, selectAuto, buildChoiceSourceFunction } from './prompt'

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
