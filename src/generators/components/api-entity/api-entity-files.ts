import {Base} from "../../core/base";
import File from '../../core/file';
import {Prompt} from "../../core/prompt";
import {IApiOptions} from "../../model/api-options.model";
import {IEntitySchema} from "../../model/options.model";


export class ApiEntityFiles extends File {

  private static API_ENTITY_TEMPLATE_PATH = '../../../../templates/component/api-entity';
  private static PYTHON37_PATH = 'python37/';

  private newEntity: IEntitySchema;

  constructor(generator: Base, opts: IApiOptions, entity: IEntitySchema) {
    super(generator, entity, ApiEntityFiles.API_ENTITY_TEMPLATE_PATH);
    this.newEntity = entity;
  }

  public files() {
    return {
      ...this.srcFiles(),
    };
  }

  private srcFiles() {
    return {
      src: [
        {
          condition: (entity: IEntitySchema) => entity.type === Prompt.ENTITY_TYPE_OBJECT_VALUE,
          path: ApiEntityFiles.PYTHON37_PATH,
          templates: [
            {
              file: 'src/schemas/schema.py.ejs',
              renameTo: `src/schemas/${this.newEntity.nameSnakeCase}.py`
            }
          ]
        }
      ]
    };
  }
}
