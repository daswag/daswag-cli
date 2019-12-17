import {Base} from "../generators/core/base";
import {IApiOptions} from "../generators/model/api-options.model";
import {IClientOptions} from "../generators/model/client-options.model";
import {IOptions} from "../generators/model/options.model";
import {IUserMgmtOptions} from "../generators/model/user-mgmt-options.model";

export default class ConfigUtils {

  public static getApiConfig(opts: IApiOptions, generator: Base): IApiOptions {
    return {
      ...opts,
      ...generator.getCommonConfig(opts),
      db: opts.db ? opts.db : generator.config.get('db'),
      language: opts.language ? opts.language : generator.config.get('language'),
      resources: opts.resources ? opts.resources : generator.config.get('resources'),
    };
  }

  public static getClientConfig(opts: IClientOptions, generator: Base): IClientOptions {
    return {
      ...opts,
      ...generator.getCommonConfig(opts),
      clientTheme: opts.clientTheme ? opts.clientTheme : generator.config.get('clientTheme'),
      framework: opts.framework ? opts.framework : generator.config.get('framework'),
      packageManager: opts.packageManager ? opts.packageManager : generator.config.get('packageManager'),
    };
  }

  public static getUserMgmtConfig(opts: IUserMgmtOptions, generator: Base): IUserMgmtOptions {
    return {
      ...opts,
      ...generator.getCommonConfig(opts),
      aliasAttributes: opts.aliasAttributes ? opts.aliasAttributes : generator.config.get('aliasAttributes'),
      replyToEmailAddress: opts.replyToEmailAddress ? opts.replyToEmailAddress : generator.config.get('replyToEmailAddress'),
      system: opts.system ? opts.system : generator.config.get('system'),
      userDataStorage: opts.userDataStorage ? opts.userDataStorage : generator.config.get('userDataStorage'),
      userSchemas: opts.userSchemas ? opts.userSchemas : generator.config.get('userSchemas'),
      userSignIn: opts.userSignIn ? opts.userSignIn : generator.config.get('userSignIn'),
      userSignUp: opts.userSignUp ? opts.userSignUp : generator.config.get('userSignUp'),
      usernameAttributes: opts.usernameAttributes ? opts.usernameAttributes : generator.config.get('usernameAttributes'),
      verifiedAttributes: opts.verifiedAttributes ? opts.verifiedAttributes : generator.config.get('verifiedAttributes'),
    };
  }
}
