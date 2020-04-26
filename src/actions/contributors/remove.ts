import { POEditor } from '@lib/poeditor'
import { Contributor, AdminContributorPermissions, ContributorPermissions, ContributorType, RemoveContributorRequest } from '@models/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { getConfirm } from '@helpers/prompt'
import inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import * as checkbox from 'inquirer-checkbox-plus-prompt'
inquirer.registerPrompt('autocomplete', autocomplete)
inquirer.registerPrompt('checkbox-plus', checkbox)

interface ContributorChoice {
  name: string,
  value: Contributor
}

/**
 * Removes one or more contributors from a project
 */
export const remove = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  const contributors: Contributor[] = await poe.listContributors({ id: project.id })

  if (!contributors.length) {
    log.info('This project has no contributors or you are lacking the access rights to view contributors')
    return
  }

  const choices = mapContributors(contributors)

  const { contributor }: { contributor: Contributor } = await inquirer.prompt([
    {
      name: 'contributor',
      type: 'autocomplete',
      message: 'Select contributor',
      source: async (_: string, input: string) => {
        if (!input) {
          return choices
        }
        return choices.filter((choice: ContributorChoice): boolean => {
          return choice.name.includes(input)
        })
      }
    }
  ])

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
    const removeAdmin = await getConfirm('You are about to remove an admin from a project. Do you want to proceed?')
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
 * Maps contributors to inquirer choice format
 * @param contributors
 */
export const mapContributors = (contributors: Contributor[]): ContributorChoice[] => {
  return contributors.map((contributor: Contributor): ContributorChoice => {
    return {
      name: `${contributor.name} ${contributor.email}`,
      value: contributor
    }
  })
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
