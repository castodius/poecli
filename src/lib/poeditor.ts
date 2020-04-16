import { default as axios } from 'axios';
import { stringify } from 'querystring';

import { variables } from '@helpers/env';

import * as POEditorModels from '@models/poeditor';
import { getToken } from '@helpers/config';

export class POEditor {
  private token: string;

  constructor(token?: string) {
    this.token = token || getToken();
  }

  private callAPI = async <T>(path: string, params?: POEditorModels.POERequestBase, ): Promise<T> => {
    const { data } = await axios.post(variables.POEditorBaseUrl + path, stringify({ api_token: this.token, ...params }), { timeout: 10000 });
    this.verifyOutput(data);
    return data;
  };

  private verifyOutput = (data: POEditorModels.POEditorResponseBase) => {
    if (data.response.status !== POEditorModels.Status.SUCCESS) {
      throw new Error(data.response.message)
    }
  }

  public listProjects = async (): Promise<POEditorModels.CompactProject[]> => {
    const data = await this.callAPI<POEditorModels.ListProjectsResponse>('/projects/list')

    return data.result.projects;
  };

  public viewProject = async (params: POEditorModels.ViewProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.ViewProjectResponse>('/projects/view', params);

    return data.result.project;
  }

  public addProject = async (params: POEditorModels.AddProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.AddProjectResponse>('/projects/add', params);

    return data.result.project;
  }

  public updateProject = async (params: POEditorModels.UpdateProjectRequest): Promise<POEditorModels.Project> => {
    const data = await this.callAPI<POEditorModels.UpdateProjectResponse>('/projects/update', params);

    return data.result.project;
  }
}