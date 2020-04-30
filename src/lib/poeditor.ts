// istanbul ignore file

import axios from 'axios'
import FormData from 'form-data'

import { stringify } from 'querystring'

import { variables } from '@helpers/env'

import * as POEditorModels from '@models/poeditor'
import { getToken } from '@helpers/config'
import { createReadStream } from 'fs'

export class POEditor {
  private token: string;

  /**
   * Creates a new POEditor class used for interacting with POEditor via their API V2
   * @param token
   * Optional token parameter used for interacting with POEditor. If not supplied it will be read from storage
   */
  constructor (token?: string) {
    this.token = token || getToken()
  }

  /**
   * Calls POEditor with a path and set of x-www-form-urlencoded parameters. The return type is supplied as a generic type
   * @param path
   * Describes which endpoint to call. For example /terms/add will call add terms
   * @param params
   * Object with keys and values which will be used as x-www-form-urlencoded data
   */
  private callAPI = async <T>(path: string, params?: POEditorModels.POERequestBase): Promise<T> => {
    const { data } = await axios.post(variables.POEditorBaseUrl + path, stringify({ api_token: this.token, ...params }), { timeout: 10000 })
    this.verifyOutput(data)
    return data
  };

  /**
   * Checks if the output from a request is valid or not.
   * @throws POEditor error if data is not valid
   */
  private verifyOutput = (data: POEditorModels.POEditorResponseBase) => {
    if (data.response.status !== POEditorModels.Status.SUCCESS) {
      throw new Error(data.response.message)
    }
  }

  /**
   * Lists all projects available.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_list
   */
  public listProjects = async (): Promise<POEditorModels.CompactProject[]> => {
    const data = await this.callAPI<POEditorModels.ListProjectsResponse>('/projects/list')

    return data.result.projects
  };

  /**
   * Returns data for a specific project.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_view
   */
  public viewProject = async (params: POEditorModels.ViewProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.ViewProjectResponse>('/projects/view', params)

    return data.result.project
  }

  /**
   * Creates a project.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_add
   */
  public addProject = async (params: POEditorModels.AddProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.AddProjectResponse>('/projects/add', params)

    return data.result.project
  }

  /**
   * Updates project information.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_update
   */
  public updateProject = async (params: POEditorModels.UpdateProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.UpdateProjectResponse>('/projects/update', params)

    return data.result.project
  }

  /**
   * Deletes a project. Only available to project owners.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_delete
   */
  public deleteProject = async (params: POEditorModels.DeleteProjectRequest): Promise<void> => {
    await this.callAPI<POEditorModels.DeleteProjectResponse>('/projects/delete', params)
  }

  /**
   * Takes a file and uses it to add data to an existing project.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_upload
   */
  public uploadProject = async (params: POEditorModels.UploadProjectRequest): Promise<POEditorModels.UpdateStatistics> => {
    const form = new FormData()
    form.append('api_token', this.token)

    // The types below are lies. Had to find a way to get this to work.
    Object.entries(params).forEach((stuff: [string, string]) => {
      const [key, value]: [string, string] = stuff
      // FormData will freak out if a value is not defined
      if (value === undefined) {
        return
      }

      if (key === 'file') {
        form.append(key, createReadStream(value))
      } else if (key === 'tags') {
        form.append(key, JSON.stringify(value))
      } else {
        form.append(key, value)
      }
    })

    // This is the only endpoint which does not support x-www-form-urlencoded format. This is why the request to POEditor takes place within the code
    const { data }: { data: POEditorModels.UploadProjectResponse } = await axios.post(variables.POEditorBaseUrl + '/projects/upload'
      , form
      , {
        headers: form.getHeaders()
      })
    this.verifyOutput(data)
    return data.result
  }

  /**
   * Syncs in data to a project. Considered a dangerous request. Can remove pretty much everything in a project.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_sync
   */
  public syncProject = async (params: POEditorModels.SyncProjectRequest): Promise<POEditorModels.UpdateStatistics> => {
    const data = await this.callAPI<POEditorModels.SyncProjectResponse>('/projects/sync', params)

    return data.result
  }

  /**
   * Exports a project for a given language.
   * Maps the following endpoint: https://poeditor.com/docs/api#projects_export
   */
  public exportProject = async (params: POEditorModels.ExportProjectRequest): Promise<string> => {
    const data = await this.callAPI<POEditorModels.ExportProjectResponse>('/projects/export', params)

    return data.result.url
  }

  /**
   * Returns a list of available languages
   * Maps the following endpoint: https://poeditor.com/docs/api#languages_available
   */
  public getAvailableLanguages = async (): Promise<POEditorModels.Language[]> => {
    const data = await this.callAPI<POEditorModels.AvailableLanguagesResponse>('/languages/available')

    return data.result.languages
  }

  /**
   * Returns a list of available languages for a project
   * Maps the following endpoint: https://poeditor.com/docs/api#languages_list
   */
  public getProjectLanguages = async (params: POEditorModels.ListLanguagesRequest): Promise<POEditorModels.ProjectLanguage[]> => {
    const data = await this.callAPI<POEditorModels.ListLanguagesResponse>('/languages/list', params)

    return data.result.languages
  };

  /**
   * Adds a language to a project
   * Maps the following endpoint: https://poeditor.com/docs/api#languages_add
   */
  public addLanguage = async (params: POEditorModels.AddLanguageRequest): Promise<void> => {
    await this.callAPI<POEditorModels.AddLanguageResponse>('/languages/add', params)
  };

  /**
   * Inserts / overwrites translations.
   * Maps the following endpoint: https://poeditor.com/docs/api#languages_update
   */
  public updateLanguage = async (params: POEditorModels.UpdateLanguageRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.UpdateLanguageRequestInternal = {
      ...params,
      data: JSON.stringify(params.data)
    }

    const data = await this.callAPI<POEditorModels.UpdateLanguageResponse>('/languages/update', newParams)

    return data.result.translations
  };

  /**
   * Deletes a language from a project.
   * Maps the following endpoint: https://poeditor.com/docs/api#languages_delete
   */
  public deleteLanguage = async (params: POEditorModels.DeleteLanguageRequest): Promise<void> => {
    await this.callAPI<POEditorModels.DeleteLanguageResponse>('/languages/delete', params)
  }

  /**
   * Lists all terms for a project. Can be combined with a language.
   * Maps the following endpoint: https://poeditor.com/docs/api#terms_list
   */
  public listTerms = async (params: POEditorModels.ListTermsRequest): Promise<POEditorModels.Term[]> => {
    const data = await this.callAPI<POEditorModels.ListTermsResponse>('/terms/list', params)

    return data.result.terms
  }

  /**
   * Adds terms to a project.
   * Maps the following endpoint: https://poeditor.com/docs/api#languages_add
   */
  public addTerms = async (params: POEditorModels.AddTermsRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.AddTermsRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.AddTermResponse>('/terms/add', newParams)

    return data.result.terms
  };

  /**
   * Updates terms in a project. The unique identifier used is term+context.
   * Maps the following endpoint: https://poeditor.com/docs/api#terms_update
   */
  public updateTerms = async (params: POEditorModels.UpdateTermsRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.UpdateTermsRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.UpdateTermsResponse>('/terms/update', newParams)

    return data.result.terms
  }

  /**
   * Deletes terms from a project
   * Maps the following endpoint: https://poeditor.com/docs/api#terms_delete
   */
  public deleteTerms = async (params: POEditorModels.DeleteTermsRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.DeleteTermRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.DeleteTermsResponse>('/terms/delete', newParams)

    return data.result.terms
  }

  /**
   * Adds a comment to one or more term. A term can have many comments. Not to be confused with updateTerms.
   * Maps the following endpoint: https://poeditor.com/docs/api#terms_add_comment
   */
  public addComment = async (params: POEditorModels.AddCommentRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.AddCommentRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.AddCommentResponse>('/terms/add_comment', newParams)

    return data.result.terms
  }

  /**
   * Lists contributors for either all projects or a specific project+language.
   * Maps the following endpoint: https://poeditor.com/docs/api#contributors_list
   */
  public listContributors = async (params: POEditorModels.ListContributorsRequest): Promise<POEditorModels.Contributor[]> => {
    const data = await this.callAPI<POEditorModels.ListContributorsResponse>('/contributors/list', params)

    return data.result.contributors
  }

  /**
   * Adds a contributor to a project. A contributor can be added to one language or as an admin.
   * Maps the following endpoint: https://poeditor.com/docs/api#contributors_add
   */
  public addContributor = async (params: POEditorModels.AddContributorRequest): Promise<void> => {
    await this.callAPI<POEditorModels.AddContributorResponse>('/contributors/add', params)
  }

  /**
   * Strips a regular contributor from their access to a language or removes an admin from a project.
   * Maps the following endpoint: https://poeditor.com/docs/api#contributors_remove
   */
  public removeContributor = async (params: POEditorModels.RemoveContributorRequest): Promise<void> => {
    await this.callAPI<POEditorModels.RemoveContributorResponse>('/contributors/remove', params)
  }
}
