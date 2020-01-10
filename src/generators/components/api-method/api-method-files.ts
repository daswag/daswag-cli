import {Base} from "../../core/base";
import File from '../../core/file';
import {IApiMethodOptions, IApiOptions, IApiResourceOptions} from "../../model/api-options.model";


export class ApiMethodFiles extends File {

  private static API_METHOD_TEMPLATE_PATH = '../../../templates/component/api-method';
  private static PYTHON37_PATH = 'python37/';

  private readonly resource: IApiResourceOptions;
  private readonly method: IApiMethodOptions;

  constructor(generator: Base, options: IApiOptions, resourceContent: IApiResourceOptions, methodContent: IApiMethodOptions) {
    super(generator, {
      method: methodContent,
      resource: resourceContent
    }, ApiMethodFiles.API_METHOD_TEMPLATE_PATH);
    this.resource = resourceContent;
    this.method = methodContent;
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
              renameTo: `src/handlers/${this.resource.nameKebabCase}/${this.method.nameSnakeCase}.py`
            }
          ]
        }
      ]
    }
  }
}
