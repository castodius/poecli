import { POEditor } from '@lib/poeditor'
import { CompactProject, Language, ProjectLanguage, Term, Contributor } from '@models/poeditor'
import { mapToChoices, selectX } from '@helpers/prompt'

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
