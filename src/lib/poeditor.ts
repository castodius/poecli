import { default as axios } from 'axios';
import { stringify } from 'querystring';

import { variables } from '@helpers/env';

import * as POEditorModels from '@models/poeditor';

type POEParams = Record<string, string>;

export class POEditor {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private callAPI = async <T>(path: string, params?: POEParams, ): Promise<T> => {
    const { data } = await axios.post(variables.POEditorBaseUrl + path, stringify({ api_token: this.token, ...params }), { timeout: 10000 });
    this.verifyOutput(data);
    return data;
  };

  private verifyOutput = (data: POEditorModels.POEditorResponseBase) => {
    if(data.response.status !== POEditorModels.Status.SUCCESS){
      throw new Error(data.response.message)
    }
  }

  public listProjects = async (): Promise<POEditorModels.Project[]> => {
    const data = await this.callAPI<POEditorModels.ListProjectsResponse>('/projects/list')

    return data.result.projects;
  };
}