
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage, getTermName } from '@helpers/poeditor'
import inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import { Term, LanguageUpdateObject, TranslationContent } from '@models/poeditor'
import { getConfirmation, mapToChoices, Choice } from '@helpers/prompt'

inquirer.registerPrompt('autocomplete', autocomplete)

/**
 * Updates translations for a project+language
 */
export const update = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  const language = await selectProjectLanguage(poe, project.id)

  if (!language) {
    log.info('The selected project has no languages')
    return
  }

  const fuzzyTrigger = await getConfirmation('Do you want to mark translations for other languages as fuzzy?')

  const availableTerms: Term[] = await poe.listTerms({ id: project.id, language: language.code })
  const choices = mapToChoices<Term>(availableTerms, getTermName)

  const terms: LanguageUpdateObject[] = []

  while (true) {
    const { chosenTerm }: { chosenTerm: Term } = await inquirer.prompt([{
      name: 'chosenTerm',
      type: 'autocomplete',
      message: 'Select term+context',
      source: async (_: string, input: string) => {
        if (!input) {
          return choices
        }
        return choices.filter((choice: Choice<Term>): boolean => {
          return choice.name.includes(input)
        })
      }
    }])

    const translatedTerm: LanguageUpdateObject = {
      term: chosenTerm.term,
      context: chosenTerm.context,
      translation: {
        content: await getContent(chosenTerm)
      }
    }

    terms.push(translatedTerm)

    if (!(await getConfirmation('Do you want to translate another term?'))) {
      break
    }
  }

  const data = await poe.updateLanguage({
    id: project.id,
    language: language.code,
    fuzzy_trigger: fuzzyTrigger ? 1 : 0,
    data: terms
  })

  log.info(JSON.stringify(data))
  log.info(`Successfully removes ${language.name} from ${project.name}`)
}

/**
 * Forces user to input optionally new translations for terms. Handles both singular and plural translations
 * @param term
 * Term to translate
 */
export const getContent = async (term: Term): Promise<TranslationContent> => {
  const termContent: TranslationContent = term.translation.content
  if (typeof termContent === 'string') {
    return getTranslation('Input translation for term', termContent)
  }

  return {
    one: await getTranslation('Input translation for term', termContent.one),
    other: await getTranslation('Input translation for plural', termContent.other)
  }
}

/**
 * Forces the user to translations a term
 * @param message
 * Message to display to the user
 * @param defaultValue
 * Value to display as default, making it easier for the user to not overwrite valid values
 */
export const getTranslation = async (message: string, defaultValue?: string): Promise<string> => {
  const { translation }: { translation: string } = await inquirer.prompt([{
    name: 'translation',
    type: 'input',
    message,
    default: defaultValue
  }])

  return translation
}
