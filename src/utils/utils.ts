import * as changeCase from "change-case";
import {IApiResourceOptions} from "../generators/model/api-options.model";
import LoggerUtils from './logger-utils';
import * as pjson from "pjson";

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

  public static findResource(name: string, resources: IApiResourceOptions[]): IApiResourceOptions | undefined {
    if(!name || !resources || resources.length === 0) {
      return;
    }
    let value: IApiResourceOptions | undefined;
    resources.forEach((resource: IApiResourceOptions) => {
      if(resource.name === name) {
        value = resource;
      } else if(resource.resources) {
        value = Utils.findResource(name, resource.resources);
      }
    });
    return value;
  }

  public static isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email)
  }
}
