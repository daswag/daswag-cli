import {IOptions} from "./options.model";

export interface IApiOptions extends IOptions {
  db?: string,
  language?: string,
  resources?: IApiResourceOptions[]
}

export interface IApiResourceOptions {
  name?: string,
  nameCamelCase?: string,
  nameSnakeCase?: string,
  nameKebabCase?: string,
  path?: string,
  methods?: IApiMethodOptions[],
  resources?: IApiResourceOptions[],
}

export interface IApiMethodOptions {
  name?: string,
  nameCamelCase?: string,
  nameSnakeCase?: string,
  summary?: string,
  type?: string,
  linkedEntityName?: string,
}
