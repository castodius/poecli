import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import { TermBase, ProjectLanguage } from '@models/poeditor'
import { promptInput } from '@helpers/prompt'
import { validateTerm } from '@helpers/terms'

/**
 * Adds a single term with translation to a project
 */
export const simple = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const termText: string = await promptInput('Input term', '', validateTerm)
  const context: string = await promptInput('Input context (optional)')

  const term: TermBase = {
    term: termText,
    context
  }

  await poe.addTerms({ id: project.id, terms: [term] })
  log.info('Term added to project')

  const language: undefined | ProjectLanguage = await selectProjectLanguage(poe, project.id, 'Select language for which to add translation')
  if (!language) {
    return
  }

  const translation: string = await promptInput('Input translation for the term')

  const data = await poe.updateLanguage({
    id: project.id,
    language: language.code,
    data: [{
      term: term.term,
      context,
      translation: {
        content: translation
      }
    }]
  })

  log.info(JSON.stringify(data))
  log.info('Term and translation added to project')
}
