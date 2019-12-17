import {Base} from "../../core/base";
import File from '../../core/file';
import {IApiMethodOptions, IApiOptions} from "../../model/api-options.model";


export class ApiMethodFiles extends File {

  private static API_METHOD_TEMPLATE_PATH = '../../../templates/component/api-method';
  private static PYTHON37_PATH = 'python37/';

  private readonly resourceNameKebabCase:string;
  private readonly method: IApiMethodOptions;

  constructor(generator: Base, options: IApiOptions, resourceNameKebabCase: string, method: IApiMethodOptions) {
    super(generator, method, ApiMethodFiles.API_METHOD_TEMPLATE_PATH);
    this.resourceNameKebabCase = resourceNameKebabCase;
    this.method = method;
  }

  public files() {
    return {
      ...this.python37Files(),
    };
  }

  private python37Files() {
    return {
      src: [
        {
          path: ApiMethodFiles.PYTHON37_PATH,
          templates: [
            {
              file: 'function_handler.py.ejs',
              renameTo: `src/handlers/${this.resourceNameKebabCase}/${this.method.nameSnakeCase}.py`
            }
          ]
        }
      ]
    }
  }
}
