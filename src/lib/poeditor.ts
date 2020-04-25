import axios from 'axios'
import FormData from 'form-data'

import { stringify } from 'querystring'

import { variables } from '@helpers/env'

import * as POEditorModels from '@models/poeditor'
import { getToken } from '@helpers/config'
import { createReadStream } from 'fs'

export class POEditor {
  private token: string;

  constructor (token?: string) {
    this.token = token || getToken()
  }

  private callAPI = async <T>(path: string, params?: POEditorModels.POERequestBase): Promise<T> => {
    const { data } = await axios.post(variables.POEditorBaseUrl + path, stringify({ api_token: this.token, ...params }), { timeout: 10000 })
    this.verifyOutput(data)
    return data
  };

  private verifyOutput = (data: POEditorModels.POEditorResponseBase) => {
    if (data.response.status !== POEditorModels.Status.SUCCESS) {
      throw new Error(data.response.message)
    }
  }

  public listProjects = async (): Promise<POEditorModels.CompactProject[]> => {
    const data = await this.callAPI<POEditorModels.ListProjectsResponse>('/projects/list')

    return data.result.projects
  };

  public viewProject = async (params: POEditorModels.ViewProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.ViewProjectResponse>('/projects/view', params)

    return data.result.project
  }

  public addProject = async (params: POEditorModels.AddProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.AddProjectResponse>('/projects/add', params)

    return data.result.project
  }

  public updateProject = async (params: POEditorModels.UpdateProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.UpdateProjectResponse>('/projects/update', params)

    return data.result.project
  }

  public deleteProject = async (params: POEditorModels.DeleteProjectRequest): Promise<void> => {
    await this.callAPI<POEditorModels.DeleteProjectResponse>('/projects/delete', params)
  }

  public uploadProject = async (params: POEditorModels.UploadProjectRequest): Promise<POEditorModels.UpdateStatistics> => {
    const form = new FormData()
    form.append('api_token', this.token)

    // The types below are lies. Had to find a way to get this to work.
    Object.entries(params).forEach((stuff: [string, string]) => {
      const [key, value]: [string, string] = stuff
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

    const { data }: { data: POEditorModels.UploadProjectResponse } = await axios.post(variables.POEditorBaseUrl + '/projects/upload'
      , form
      , {
        headers: form.getHeaders()
      })
    this.verifyOutput(data)
    return data.result
  }

  public syncProject = async (params: POEditorModels.SyncProjectRequest): Promise<POEditorModels.UpdateStatistics> => {
    const data = await this.callAPI<POEditorModels.SyncProjectResponse>('/projects/sync', params)

    return data.result
  }

  public exportProject = async (params: POEditorModels.ExportProjectRequest): Promise<string> => {
    const data = await this.callAPI<POEditorModels.ExportProjectResponse>('/projects/export', params)

    return data.result.url
  }

  public getAvailableLanguages = async (): Promise<POEditorModels.Language[]> => {
    const data = await this.callAPI<POEditorModels.AvailableLanguagesResponse>('/languages/available')

    return data.result.languages
  }

  public getProjectLanguages = async (params: POEditorModels.ListLanguagesRequest): Promise<POEditorModels.ProjectLanguage[]> => {
    const data = await this.callAPI<POEditorModels.ListLanguagesResponse>('/languages/list', params)

    return data.result.languages
  };

  public addLanguage = async (params: POEditorModels.AddLanguageRequest): Promise<void> => {
    await this.callAPI<POEditorModels.AddLanguageResponse>('/languages/add', params)
  };

  public updateLanguage = async (params: POEditorModels.UpdateLanguageRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.UpdateLanguageRequestInternal = {
      ...params,
      data: JSON.stringify(params.data)
    }

    const data = await this.callAPI<POEditorModels.UpdateLanguageResponse>('/languages/update', newParams)

    return data.result.translations
  };

  public deleteLanguage = async (params: POEditorModels.DeleteLanguageRequest): Promise<void> => {
    await this.callAPI<POEditorModels.DeleteLanguageResponse>('/languages/delete', params)
  }

  public listTerms = async (params: POEditorModels.ListTermsRequest): Promise<POEditorModels.Term[]> => {
    const data = await this.callAPI<POEditorModels.ListTermsResponse>('/terms/list', params)

    return data.result.terms
  }

  public addTerms = async (params: POEditorModels.AddTermsRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.AddTermsRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.AddTermResponse>('/terms/add', newParams)

    return data.result.terms
  };

  public updateTerms = async (params: POEditorModels.UpdateTermsRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.UpdateTermsRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.UpdateTermsResponse>('/terms/update', newParams)

    return data.result.terms
  }

  public deleteTerms = async (params: POEditorModels.DeleteTermsRequest): Promise<POEditorModels.UpdateStatisticsObject> => {
    const newParams: POEditorModels.DeleteTermRequestInternal = {
      ...params,
      data: JSON.stringify(params.terms)
    }

    const data = await this.callAPI<POEditorModels.DeleteTermsResponse>('/terms/delete', newParams)

    return data.result.terms
  }
}
