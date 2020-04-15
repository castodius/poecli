export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail'
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
    projects: Project[]
  }
}

export interface Project {
  id: number;
  name: string;
  public: 0 | 1;
  open: 0 | 1;
  created: string;
}