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

export interface CompactProject {
  id: number;
  name: string;
  public: 0 | 1;
  open: 0 | 1;
  created: string;
}

export interface Project extends CompactProject{
  description: string;
  reference_language: string;
  terms: number;
}

export interface Language {
  name: string;
  code: string;
}

export interface ProjectLanguage extends Language{
  translations: number;
  percentage: number;
  updated: string;
}

export interface ListProjectsResponse extends POEditorResponseBase {
  result: {
    projects: CompactProject[]
  }
}

export interface ViewProjectRequest extends POERequestBase {
  id: number;
}

export interface ViewProjectResponse extends POEditorResponseBase {
  result: {
    project: Project
  }
}

export interface AddProjectRequest {
  name: string;
  description?: string;
}

export interface AddProjectResponse extends POEditorResponseBase {
  result: {
    project: Project;
  }
}

export interface UpdateProjectRequest {
  id: number;
  name?: string;
  description?: string;
  reference_language?: string;
}

export interface UpdateProjectResponse extends POEditorResponseBase {
  result: {
    project: Project;
  }
}

export interface DeleteProjectRequest {
  id: number;
}

export interface DeleteProjectResponse extends POEditorResponseBase {

}

export interface AvailableLanguagesResponse extends POEditorResponseBase {
  result: {
    languages: Language[]
  }
}

export interface ListLanguagesRequest extends POERequestBase {
  id: number;
}

export interface ListLanguagesResponse extends POEditorResponseBase {
  result: {
    languages: ProjectLanguage[];
  }
}

export interface AddLanguageRequest extends POERequestBase {
  id: number;
  language: string;
}

export interface AddLanguageResponse extends POEditorResponseBase {

}

export interface DeleteLanguageRequest extends POERequestBase{
  id: number;
  language: string;
}

export interface DeleteLanguageResponse extends POEditorResponseBase {

}
