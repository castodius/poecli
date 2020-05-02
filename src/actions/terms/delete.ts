import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, getTermName } from '@helpers/poeditor'
import { Term, DeleteTerm } from '@models/poeditor'
import { mapToChoices, selectCheckboxPlus, buildChoiceSourceFunction } from '@helpers/prompt'

export const deleteTerms = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const terms: Term[] = await poe.listTerms({ id: project.id })
  const choices = mapToChoices<Term>(terms, getTermName)

  const toDelete: Term[] = await selectCheckboxPlus('Select terms to delete', buildChoiceSourceFunction<Term>(choices))

  const data = await poe.deleteTerms({ id: project.id, terms: mapChoiceToDeleteTerm(toDelete) })

  log.info('Terms deleted')
  log.info(JSON.stringify(data))
}

export const mapChoiceToDeleteTerm = (terms: Term[]): DeleteTerm[] => {
  return terms.map(({ term, context }: Term): DeleteTerm => {
    return {
      term,
      context
    }
  })
}
