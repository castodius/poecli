export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail'
}

export type POBoolean = 0 | 1;

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

export enum UpdateTag {
  ALL = 'all',
  NEW = 'new',
  OBSOLETE = 'obsolete',
  OVERWRITTEN_TRANSLATIONS = 'overwritten_translations'
}

export type UpdateTagObject = Record<UpdateTag, string[]>

export type TranslationContent = string | { one: string, other: string };

export interface LanguageUpdateObject {
  term: string;
  context: string;
  translation: {
    content: TranslationContent
    fuzzy?: POBoolean
  }
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
  public: POBoolean;
  open: POBoolean;
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
  context: string;
  plural?: string;
  reference?: string;
  tags?: string[];
  comment?: string;
}

export interface Term extends TermBase {
  created: string;
  updated: string;
  translation: {
    content: TranslationContent;
    fuzzy: POBoolean;
    proofread: POBoolean;
    updated: string;
  };
}

export interface UpdateTerm extends TermBase {
  new_term: string;
  new_context: string;
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
  overwrite?: POBoolean;
  sync_terms?: POBoolean;
  tags?: string[] | UpdateTagObject;
  read_from_source?: POBoolean;
  fuzzy_trigger?: POBoolean;
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

interface UpdateLanguageRequestBase extends POERequestBase {
  id: number;
  language: string;
  fuzzy_trigger?: POBoolean;
}
export interface UpdateLanguageRequest extends UpdateLanguageRequestBase {
  data: LanguageUpdateObject[];
}

export interface UpdateLanguageRequestInternal extends UpdateLanguageRequestBase {
  data: string;
}

export interface UpdateLanguageResponse extends POEditorResponseBase {
  result: {
    translations: UpdateStatisticsObject;
  }
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

export interface AddTermsRequest extends POERequestBase {
  id: number;
  terms: TermBase[];
}

export interface AddTermsRequestInternal extends POERequestBase {
  id: number;
  data: string;
}

export interface AddTermResponse extends POEditorResponseBase {
  result: {
    terms: UpdateStatisticsObject;
  }
}

export interface UpdateTermsRequest extends POERequestBase {
  id: number;
  fuzzy_trigger?: POBoolean;
  terms: UpdateTerm[];
}

export interface UpdateTermsRequestInternal extends POERequestBase {
  id: number;
  fuzzy_trigger?: POBoolean;
  data: string;
}

export interface UpdateTermsResponse extends POEditorResponseBase {
  result: {
    terms: UpdateStatisticsObject;
  }
}
