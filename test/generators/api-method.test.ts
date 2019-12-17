import {expect} from "chai";
import * as fse from "fs-extra";
import * as path from 'path';
import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';
import {Base} from "../../src/generators/core/base";
import {Prompt} from '../../src/generators/core/prompt';
import {IApiOptions} from "../../src/generators/model/api-options.model";
import {ApiPrompts} from '../../src/generators/services/api/api-prompts';
import {ConstantsUtils} from "../../src/utils/constants-utils";
import LoggerUtils from "../../src/utils/logger-utils";
import {YamlUtils} from "../../src/utils/yaml-utils";
import FileTools from "../tools/file-tools";

describe('daswag:api-method', () => {
  context('generate an API Method', () => {
    describe('with default parameters', () => {
      let generator: Base;
      const method = {
        type: 'get',
        summary: 'Get all users',
        name: 'GetAllUsers',
        linkedEntityName: 'Users',
      };
      const config : IApiOptions = {
        baseName: 'SampleApp',
        baseNameCamelCase: 'SampleAppApi',
        baseNameKebabCase: 'sample-app-api',
        db: ApiPrompts.DB_DYNAMODB_VALUE,
        iac: Prompt.IAC_SAM_VALUE,
        language: ApiPrompts.LANGUAGE_PYTHON37_VALUE,
        provider: Prompt.PROVIDER_AWS_VALUE,
        resources: [
          {
            name: "users",
            nameSnakeCase: "users",
            path: "/users",
            methods: [
              method
            ]
          }
        ],
      };
      it('creates expected files for given method configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/components/api-method'))
          .inTmpDir((dir) => {
            fse.copySync(path.join(__dirname, '../data/templates/sample-app/sample-app-api'), dir);
            fse.copySync(path.join(__dirname, '../data/result-swagger-entity-users.yaml'), path.join(dir, 'specs/specs.yaml'));
            fse.copySync(path.join(__dirname, '../data/init-template.yaml'), path.join(dir, 'template.yaml'));
          })
          .withOptions({
            action: ConstantsUtils.ACTION_INIT,
          })
          .withPrompts({
            ...method,
            resourceName: 'users',

          })
          .on('ready',  (gen) => {
            // This is called right before `generator.run()` is calledclear
            generator = gen;
          })
          .then((dir) => {
            const logger = LoggerUtils.createLogger("ApiMethod");
            if(config.baseNameKebabCase) {
              logger.info(dir);
              assert.file(path.join(dir, '.yo-rc.json'));
              assert.jsonFileContent(path.join(dir, '.yo-rc.json'), {"daswag-cli": config});
              FileTools.assertFilesExist(config, dir, '', FileTools.EXPECTED_FILES.apiEntity);
              // Verify Swagger content
              const targetSwaggerContent = YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-method.yaml'));
              const sourceSwaggerContent = YamlUtils.readYaml(path.join(dir, 'specs/specs.yaml'));
              expect(JSON.stringify(sourceSwaggerContent)).to.be.equal(JSON.stringify(targetSwaggerContent));

              // Verify template content
              const targetTemplateContent = YamlUtils.readYaml(path.join(__dirname, '../data/result-template-function.yaml'));
              const sourceTemplateContent = YamlUtils.readYaml(path.join(dir, 'template.yaml'));
              expect(JSON.stringify(sourceTemplateContent)).to.be.equal(JSON.stringify(targetTemplateContent));
            }
          });
      });
    });
  });
});
