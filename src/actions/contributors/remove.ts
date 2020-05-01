import { POEditor } from '@lib/poeditor'
import { Contributor, AdminContributorPermissions, ContributorPermissions, ContributorType, RemoveContributorRequest } from '@models/poeditor'
import * as log from '@lib/log'
import { selectProject, getContributorName } from '@helpers/poeditor'
import { getConfirmation, mapToChoices, Choice, selectAutoX } from '@helpers/prompt'
import inquirer from 'inquirer'
import * as checkbox from 'inquirer-checkbox-plus-prompt'
inquirer.registerPrompt('checkbox-plus', checkbox)

/**
 * Removes one or more contributors from a project
 */
export const remove = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }
  const contributors: Contributor[] = await poe.listContributors({ id: project.id })

  if (!contributors.length) {
    log.info('This project has no contributors or you are lacking the access rights to view contributors')
    return
  }

  const choices = mapToChoices<Contributor>(contributors, getContributorName)
  const contributor: Contributor = await selectAutoX<Contributor>('Select contributor', buildContributorSourceFunction(choices))

  const projectPermissions = getProjectPermissions(contributor, project.id)
  if (!projectPermissions) {
    log.info('You found a unicorn! This should not be possible. Sorry for the inconvenience')
    return
  }

  const params: RemoveContributorRequest = {
    id: project.id,
    email: contributor.email
  }
  if (projectPermissions.type === ContributorType.ADMIN) {
    const removeAdmin = await getConfirmation('You are about to remove an admin from a project. Do you want to proceed?')
    if (!removeAdmin) {
      return
    }
    await poe.removeContributor(params)
    log.info('Contributors removed')
  } else {
    const languages = await selectLanguages(projectPermissions.languages)
    if (!languages) {
      log.info('No languages chosen, aborting')
      return
    }

    for (let i = 0; i < languages.length; i++) {
      params.language = languages[i]
      await poe.removeContributor(params)
      log.info(`${contributor.email} removed from ${languages[i]}`)
    }
  }
}

/**
 * Creates an inquirer autocomplete source function
 * @param choices
 * Choices to be used in function
 */
export const buildContributorSourceFunction = (choices: Choice<Contributor>[]): (_ : string, input: string) => Promise<Choice<Contributor>[]> => {
  return async (_: string, input: string): Promise<Choice<Contributor>[]> => {
    if (!input) {
      return choices
    }
    return choices.filter((choice: Choice<Contributor>): boolean => {
      return choice.name.includes(input)
    })
  }
}

/**
 * Finds project permissions for a contributor
 * @param contributor
 * POEditor contributor data
 * @param id
 * Project id. For example 123456
 */
export const getProjectPermissions = (contributor: Contributor, id: number): AdminContributorPermissions | ContributorPermissions | undefined => {
  return contributor.permissions.find((permissions: AdminContributorPermissions | ContributorPermissions): boolean => {
    return permissions.project.id === id.toString()
  })
}

/**
 * Multi-select languages
 * @param languages
 * Array of languages. For example ['sv', 'en']
 */
export const selectLanguages = async (languages: string[]): Promise<string[]> => {
  const { chosenLanguages }: { chosenLanguages: string[] } = await inquirer.prompt([
    {
      name: 'chosenLanguages',
      type: 'checkbox-plus',
      message: 'Select languages to remove. Select all to remove contributor from project',
      source: async (_: string, input: string): Promise<string[]> => {
        if (!input) {
          return languages
        }

        return languages.filter((language: string): boolean => {
          return language.includes(input)
        })
      }
    }
  ])

  return chosenLanguages
}
