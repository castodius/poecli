import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { Term, DeleteTermComment } from '@models/poeditor'
import inquirer from 'inquirer'
import * as checkbox from 'inquirer-checkbox-plus-prompt'

inquirer.registerPrompt('checkbox-plus', checkbox)

interface TermChoice {
  name: string,
  value: Term
}

export const deleteTerms = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const terms: Term[] = await poe.listTerms({ id: project.id })
  const choices: TermChoice[] = mapTerms(terms)

  const { toDelete }: { toDelete: Term[] } = await inquirer.prompt([
    {
      name: 'toDelete',
      type: 'checkbox-plus',
      message: 'Select terms to delete',
      searchable: true,
      source: async (_: Record<string, string>, input: string): Promise<TermChoice[]> => {
        if (!input) {
          return choices
        }
        return choices.filter((choice: TermChoice): boolean => {
          return choice.name.includes(input)
        })
      }
    }
  ])

  const data = await poe.deleteTerms({ id: project.id, terms: mapChoiceToDeleteTerm(toDelete) })

  log.info('Terms deleted')
  log.info(JSON.stringify(data))
}

export const mapTerms = (terms: Term[]): TermChoice[] => {
  return terms.map((term: Term): TermChoice => {
    return {
      name: term.context ? `${term.term} ${term.context}` : term.term,
      value: term
    }
  })
}

export const mapChoiceToDeleteTerm = (terms: Term[]): DeleteTermComment[] => {
  return terms.map(({ term, context }: Term): DeleteTermComment => {
    return {
      term,
      context
    }
  })
}
