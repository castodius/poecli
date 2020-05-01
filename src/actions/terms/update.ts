import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, validateTerm, inputTags, getTermName, buildTermSourceFunction } from '@helpers/poeditor'
import { Term, UpdateTerm } from '@models/poeditor'
import inquirer from 'inquirer'
import { getConfirmation, mapToChoices, selectAuto } from '@helpers/prompt'

/**
 * Updates terms
 */
export const update = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const terms: Term[] = await poe.listTerms({ id: project.id })
  const choices = mapToChoices<Term>(terms, getTermName)

  const updatedTerms: UpdateTerm[] = []

  while (true) {
    const term: Term = await selectAuto<Term>('Select term+context', buildTermSourceFunction(choices))

    // interface below is a lie, missing term and context
    const updatedTerm: UpdateTerm = await inquirer.prompt([
      {
        name: 'new_term',
        type: 'input',
        message: 'Input new term',
        default: term.term,
        validate: validateTerm
      },
      {
        name: 'new_context',
        type: 'input',
        message: 'Input new context (optional)',
        default: term.context
      },
      {
        name: 'reference',
        type: 'input',
        message: 'Input reference (optional)',
        default: term.reference
      },
      {
        name: 'plural',
        type: 'input',
        message: 'Input plural (optional)',
        default: term.plural
      }
    ])

    const tags = await inputTags()

    updatedTerm.term = term.term
    updatedTerm.context = term.context
    updatedTerm.tags = tags
    updatedTerms.push(updatedTerm)

    if (!(await getConfirmation('Do you want to update another term?'))) {
      break
    }
  }

  const fuzzyTrigger = await getConfirmation('Do you want to mark translations for other languages as fuzzy?')

  const data = await poe.updateTerms({ id: project.id, terms: updatedTerms, fuzzy_trigger: fuzzyTrigger ? 1 : 0 })

  log.info('Terms updated')
  log.info(JSON.stringify(data))
}
