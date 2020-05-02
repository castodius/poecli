
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage, getTermName } from '@helpers/poeditor'
import { Term, LanguageUpdateObject, TranslationContent } from '@models/poeditor'
import { getConfirmation, mapToChoices, selectAuto, promptInput, buildChoiceSourceFunction } from '@helpers/prompt'

/**
 * Updates translations for a project+language
 */
export const update = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }
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
    const chosenTerm: Term = await selectAuto<Term>('Select term+context', buildChoiceSourceFunction<Term>(choices))
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
    return promptInput('Input translation for term', termContent)
  }

  return {
    one: await promptInput('Input translation for term', termContent.one),
    other: await promptInput('Input translation for plural', termContent.other)
  }
}
