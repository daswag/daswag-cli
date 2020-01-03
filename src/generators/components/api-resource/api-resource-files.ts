import {Base} from "../../core/base";
import File from '../../core/file';
import {IApiResourceOptions} from "../../model/api-options.model";


export class ApiResourceFiles extends File {

  private static API_RESOURCE_TEMPLATE_PATH = '../../../templates/component/api-resource';

  private resource: IApiResourceOptions;

  constructor(generator: Base, resource: IApiResourceOptions) {
    super(generator, resource, ApiResourceFiles.API_RESOURCE_TEMPLATE_PATH);
    this.resource = resource;
  }

  public files() {
    return {
      ...this.commonFiles(),
    };
  }

  private commonFiles() {
    return {
      src: [
        {
          templates: [
            {
              file: '__init__.py.ejs',
              renameTo: `src/handlers/${this.resource.nameKebabCase}/__init__.py`
            }
          ]
        }
      ]
    }
  }
}
