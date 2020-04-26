import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, multiSelectTerms } from '@helpers/poeditor'
import { Term, AddTermComment } from '@models/poeditor'
import inquirer from 'inquirer'

/**
 * Adds comments to terms
 */
export const comment = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const terms: Term[] = await multiSelectTerms(poe, project.id)
  if (!terms.length) {
    log.info('The select project has no terms')
    return
  }

  const termsWithComments: AddTermComment[] = []
  for (let i = 0; i < terms.length; i++) {
    const term: Term = terms[i]
    const { comment }: {comment: string} = await inquirer.prompt([
      {
        name: 'comment',
        type: 'input',
        message: `Add a comment to "${term.term} ${term.context}" (optional)`
      }
    ])

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
