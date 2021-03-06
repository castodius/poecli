import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { Term, AddTermComment } from '@models/poeditor'
import { promptInput } from '@helpers/prompt'
import { multiSelectTerms } from '@helpers/terms'

/**
 * Adds comments to terms
 */
export const comment = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const terms: Term[] = await multiSelectTerms(poe, project.id)
  if (!terms.length) {
    log.info('The selected project has no terms')
    return
  }

  const termsWithComments: AddTermComment[] = []
  for (let i = 0; i < terms.length; i++) {
    const term: Term = terms[i]
    const comment: string = await promptInput(`Add a comment to "${term.term} ${term.context}" (optional)`)
    if (!comment) {
      log.info('Ignoring empty comment')
      continue
    }

    termsWithComments.push({
      term: term.term,
      context: term.context,
      comment
    })
  }

  const data = await poe.addComment({ id: project.id, terms: termsWithComments })
  log.info('Comments added')
  log.info(JSON.stringify(data))
}
