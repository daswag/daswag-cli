import * as changeCase from "change-case";
import * as pjson from "pjson";
import {IApiMethodOptions, IApiParameter, IApiResourceOptions} from "../generators/model/api-options.model";
import {ConstantsUtils} from "./constants-utils";
import LoggerUtils from './logger-utils';

export default class Utils {

  public static logger = LoggerUtils.createLogger('Utils');

  public static getVersion(): string {
    return pjson.version;
  }

  /**
   * Format given base name and add a suffix
   * @param baseName The base name
   * @param suffix The suffix to add
   */
  public static formatBaseName(baseName: string | undefined, suffix: string) {
    if(!baseName) {
      return '';
    }
    const upperSuffix = changeCase.pascalCase(suffix);
    return changeCase.pascalCase(baseName + (baseName.toLowerCase().endsWith(upperSuffix.toLowerCase()) ? '' : upperSuffix));
  }

  public static getResourcePathParam(path: string, resources: IApiResourceOptions[] | undefined): IApiParameter[] {
    const resourcePathParam: IApiParameter[] = [];
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        if(resource.path === path && resource.parameters) {
          resource.parameters.forEach((param: IApiParameter) => {
            if(param.type && param.type === ConstantsUtils.PATH_PATH) {
              resourcePathParam.push(param);
            }
          })
        }
      });
    }
    return resourcePathParam;
  }

  public static findResourceByPath(path: string, resources: IApiResourceOptions[] | undefined): IApiResourceOptions | undefined {
    let result: IApiResourceOptions | undefined;
    if(resources) {
      resources.forEach((resource:IApiResourceOptions) => {
        if(resource.path === path) {
          result = resource;
        }
      });
    }
    return result;
  }

  public static findResourceByMethodName(name: string, resources: IApiResourceOptions[] | undefined): IApiResourceOptions | undefined {
    let result: IApiResourceOptions | undefined;
    if(resources) {
      resources.forEach((resource:IApiResourceOptions) => {
        if(resource.methods) {
          resource.methods.forEach((method: IApiMethodOptions) => {
            if(method.name && method.name === name) {
              result = resource;
            }
          });
        }
      });
    }
    return result;
  }

  public static isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email)
  }
}
