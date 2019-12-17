import {IOptions} from "./options.model";

export interface IClientOptions extends IOptions {
  framework?: string,
  packageManager?: string,
  clientTheme?: string
}
