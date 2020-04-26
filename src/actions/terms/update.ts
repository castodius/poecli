import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, validateTerm, inputTags } from '@helpers/poeditor'
import { Term, UpdateTerm } from '@models/poeditor'
import inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import { getConfirm } from '@helpers/prompt'

inquirer.registerPrompt('autocomplete', autocomplete)

interface TermChoice {
  name: string,
  value: Term
}

/**
 * Updates terms
 */
export const update = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const terms: Term[] = await poe.listTerms({ id: project.id })
  const choices: TermChoice[] = mapTerms(terms)

  const updatedTerms: UpdateTerm[] = []

  while (true) {
    const { term }: {term: Term} = await inquirer.prompt([{
      name: 'term',
      type: 'autocomplete',
      message: 'Select term+context',
      source: async (_: string, input: string) => {
        if (!input) {
          return choices
        }
        return choices.filter((choice: TermChoice): boolean => {
          return choice.name.includes(input)
        })
      }
    }])

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

    if (!(await getConfirm('Do you want to update another term?'))) {
      break
    }
  }

  const fuzzyTrigger = await getConfirm('Do you want to mark translations for other languages as fuzzy?')

  const data = await poe.updateTerms({ id: project.id, terms: updatedTerms, fuzzy_trigger: fuzzyTrigger ? 1 : 0 })

  log.info('Terms updated')
  log.info(JSON.stringify(data))
}

/**
 * Maps terms to inquirer choice format
 * @param terms
 * Array of terms to maps
 */
export const mapTerms = (terms: Term[]): TermChoice[] => {
  return terms.map((term: Term): TermChoice => {
    return {
      name: term.context ? `${term.term} ${term.context}` : term.term,
      value: term
    }
  })
}
