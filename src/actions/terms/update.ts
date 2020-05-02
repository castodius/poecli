import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, validateTerm, inputTags, getTermName, buildTermSourceFunction } from '@helpers/poeditor'
import { Term, UpdateTerm } from '@models/poeditor'
import { getConfirmation, mapToChoices, selectAuto, promptInput } from '@helpers/prompt'

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

    const newTerm = await promptInput('Input new term', term.term, validateTerm)
    const newContext = await promptInput('Input new context (optional)', term.context)
    const reference = await promptInput('Input reference (optional)', term.reference)
    const plural = await promptInput('Input plural (optional)', term.plural)

    const tags = await inputTags()

    const updatedTerm: UpdateTerm = {
      new_term: newTerm,
      new_context: newContext,
      reference,
      plural,
      term: term.term,
      context: term.context,
      tags
    }
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
