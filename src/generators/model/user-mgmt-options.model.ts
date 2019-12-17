import {IAttributeSchema, IOptions} from "./options.model";

export interface IUserMgmtOptions extends IOptions {
  aliasAttributes?: string[],
  system?: string,
  userDataStorage?: boolean,
  userSignUp?: boolean,
  userSignIn?: string,
  usernameAttributes?: string,
  verifiedAttributes?: string[],
  replyToEmailAddress?: string,
  userSchemas?: IAttributeSchema[],
}
