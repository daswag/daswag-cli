
export interface IOptions {
  version?: string,
  baseName?: string,
  baseNameCamelCase?: string,
  baseNameKebabCase?: string,

  iac?: string,
  provider?: string,
  entities?: IEntitySchema[],
}

export interface IEntitySchema {
  name?: string,
  nameCamelCase?: string,
  nameKebabCase?: string,
  nameSnakeCase?: string,
  type?: string,
  linkedEntityName?: string,
  attributes?: IAttributeSchema[],
}

export interface IAttributeSchema {
  attributeDataType?: string,
  mutable?: boolean,
  name?: string,
  custom?: boolean,
  numberAttributeConstraints?: INumberAttributeConstraint,
  required?: boolean
  stringAttributeConstraints?: IStringAttributeConstraint,
}

export interface INumberAttributeConstraint {
  maxValue?: string | number
  minValue?: string | number
}

export interface IStringAttributeConstraint {
  maxLength?: string | number
  minLength?: string | number
}
