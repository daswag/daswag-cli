import {Base} from "../../core/base";
import File from '../../core/file';
import {IApiOptions} from '../../model/api-options.model';

export class ApiFiles extends File {

  private static API_TEMPLATE_PATH = '../../../templates/api';
  private static PYTHON37_PATH = 'python37/';

  constructor(generator: Base, options: IApiOptions) {
    super(generator, options, ApiFiles.API_TEMPLATE_PATH);
  }

  public files() {
    return {
      ...this.commonFiles(),
      ...this.python37Files(),
    };
  }

  private commonFiles() {
    return {
      common: [
        {
          templates: [
            'docs/config/config.properties',
            'docs/files/.gitkeep',
            'docs/images/.gitkeep',
            'docs/content/overview.adoc',
            {
              file: 'docs/index.adoc',
              renameTo: `docs/${this.options.baseNameKebabCase}.adoc`
            },
          ]
        },
        {
          templates: [
            'specs/specs.yaml'
          ]
        },
        {
          templates: [
            'README.md',
            'Makefile',
            '.gitignore',
            'sonar-project.properties',
            'template-init.yaml',
            'template.yaml'
          ]
        },
      ]
    };
  }

  private python37Files() {
    return {
      project: [
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'dev-requirements.txt',
            'test-requirements.txt',
            'requirements.txt',
            'setup.cfg',
            'setup.py',
            'tox.ini',
            'VERSION'
          ]
        },
      ],
      src: [
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'src/__init__.py',
            'src/main.py'
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'src/core/__init__.py',
            'src/core/config.py',
            'src/core/logger.py',
            'src/core/request.py',
            'src/core/response.py',
            'src/core/decorator/__init__.py',
            'src/core/decorator/api_endpoint.py',
            'src/core/decorator/api_params.py',
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'src/handlers/__init__.py',

          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'src/schemas/__init__.py',
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'src/services/__init__.py',
          ]
        },
      ],
      test: [
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'tests/__init__.py',
            'tests/conftest.py',
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'tests/data/create-table.json',
            'tests/data/data.json',
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'tests/unit/__init__.py',
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'tests/unit/core/__init__.py',
            'tests/unit/core/test_logger.py',
            'tests/unit/core/test_response.py',
            'tests/unit/core/test_request.py',
            'tests/unit/core/decorator/__init__.py',
            'tests/unit/core/decorator/test_api_endpoint.py',
            'tests/unit/core/decorator/test_api_params.py',
          ]
        },
        {
          path: ApiFiles.PYTHON37_PATH,
          templates: [
            'tests/unit/handlers/__init__.py',
          ]
        },
      ],
    };
  }

}
