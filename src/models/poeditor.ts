export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail'
}

export enum FileType {
  PO = 'po',
  POT = 'pot',
  MO = 'mo',
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  INI = 'ini',
  RES = 'resw',
  RESX = 'resx',
  ANDROID_STRINGS = 'android_strings',
  APPLE_STRING = 'apple_strings',
  XLIFF = 'xliff',
  PROPERTIES = 'properties',
  KEY_VALUE_JSON = 'key_value_json',
  JSON = 'json',
  YML = 'yml',
  XLF = 'xlf',
  XMB = 'xmb',
  XTB = 'xtb'
}

export enum ExportFilter {
  TRANSLATED = 'translated',
  UNTRANSLATED = 'untranslated',
  FUZZY = 'fuzzy',
  NOT_FUZZY = 'not_fuzzy',
  AUTOMATIC = 'automatic',
  NOT_AUTOMATIC = 'not_automatic',
  PROOFREAD = 'proofread',
  NOT_PROOFREAD = 'not_proofread'
}

export enum UpdateType {
  TERMS = 'terms',
  TERMS_TRANSLATIONS = 'terms_translations',
  TRANSLATIONS = 'translations'
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

export interface Project extends CompactProject {
  description: string;
  reference_language: string;
  terms: number;
}

export interface Language {
  name: string;
  code: string;
}

export interface ProjectLanguage extends Language {
  translations: number;
  percentage: number;
  updated: string;
}

export interface TermBase {
  term: string;
  context?: string;
  plural?: string;
  reference?: string;
  tags?: string[];
  comment?: string;
}

export interface Term extends TermBase {
  created: string;
  updated: string;
  translation: {
    content: string;
    fuzzy: 0 | 1;
    proofread: 0 | 1;
    updated: string;
  };
}

export interface UpdateStatisticsObject {
  parsed?: number,
  added?: number,
  updated?: number,
  deleted?: number
}

export interface UpdateStatistics {
  terms?: UpdateStatisticsObject;
  translations?: UpdateStatisticsObject;
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

export interface UploadProjectRequest extends POERequestBase {
  id: number;
  updating: UpdateType;
  file: string;
  language?: string;
  overwrite?: 0 | 1;
  sync_terms?: 0 | 1;
  tags?: string[];
  read_from_source?: 0 | 1;
  fuzzy_trigger?: 0 | 1;
}

export interface UploadProjectResponse extends POEditorResponseBase {
  result: UpdateStatistics
}

export interface SyncProjectRequest extends POERequestBase {
  id: number;
  data: string;
}

export interface SyncProjectResponse extends POEditorResponseBase {
  result: UpdateStatistics
}

export interface ExportProjectRequest {
  id: number;
  language: string;
  type: FileType;
  filters?: ExportFilter[]
  tags?: string[];
  order?: string;
}

export interface ExportProjectResponse {
  result: {
    url: string;
  }
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

export interface DeleteLanguageRequest extends POERequestBase {
  id: number;
  language: string;
}

export interface DeleteLanguageResponse extends POEditorResponseBase {

}

export interface ListTermsRequest extends POERequestBase {
  id: number;
  language?: string;
}

export interface ListTermsResponse extends POEditorResponseBase {
  result: {
    terms: Term[];
  }
}
