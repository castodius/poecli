import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, getTermName } from '@helpers/poeditor'
import { Term, DeleteTerm } from '@models/poeditor'
import inquirer from 'inquirer'
import * as checkbox from 'inquirer-checkbox-plus-prompt'
import { mapToChoices, Choice } from '@helpers/prompt'

inquirer.registerPrompt('checkbox-plus', checkbox)

export const deleteTerms = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const terms: Term[] = await poe.listTerms({ id: project.id })
  const choices = mapToChoices<Term>(terms, getTermName)

  const { toDelete }: { toDelete: Term[] } = await inquirer.prompt([
    {
      name: 'toDelete',
      type: 'checkbox-plus',
      message: 'Select terms to delete',
      searchable: true,
      source: async (_: Record<string, string>, input: string): Promise<Choice<Term>[]> => {
        if (!input) {
          return choices
        }
        return choices.filter((choice: Choice<Term>): boolean => {
          return choice.name.includes(input)
        })
      }
    }
  ])

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
