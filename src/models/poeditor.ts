export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail'
}

export interface POERequestBase {

}

export interface POEditorResponseBase {
  response: {
    status: Status;
    message: string;
    code: string;
  }
}

export interface ListProjectsResponse extends POEditorResponseBase {
  result: {
    projects: ListProjectsResult[]
  }
}

export interface ListProjectsResult {
  id: number;
  name: string;
  public: 0 | 1;
  open: 0 | 1;
  created: string;
}

export interface ViewProjectRequest extends POERequestBase {
  id: number;
}

export interface ViewProjectResponse extends POEditorResponseBase {
  result: {
    project: ViewProjectResult
  }
}

export interface ViewProjectResult {
  id: number;
  name: string;
  description: string;
  public: 0 | 1;
  open: 0 | 1;
  reference_language: string;
  terms: number;
  created: string;
}