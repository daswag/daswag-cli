import {expect} from "chai";
import * as fse from "fs-extra";
import * as path from 'path';
import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';
import {ApiFiles} from "../../src/generators/services/api/api-files";
import {ApiPrompts} from '../../src/generators/services/api/api-prompts';
import {ApiEntityPrompts} from "../../src/generators/components/api-entity/api-entity-prompts";
import {Base} from "../../src/generators/core/base";
import {Prompt} from '../../src/generators/core/prompt';
import {IApiOptions} from "../../src/generators/model/api-options.model";
import {ConstantsUtils} from "../../src/utils/constants-utils";
import {YamlUtils} from "../../src/utils/yaml-utils";
import FileTools from "../tools/file-tools";

describe('daswag:api-entity', () => {
  context('generate an API-ENTITY', () => {
    describe('with default parameters', () => {
      let generator: Base;
      const entity = {
        name: 'Users' ,
        nameCamelCase: 'Users',
        nameKebabCase: 'users',
        nameSnakeCase: 'users',
        type: ApiEntityPrompts.ENTITY_TYPE_ARRAY_VALUE,
        linkedEntityName: 'User',
      };
      const config : IApiOptions = {
        baseName: 'SampleApp',
        baseNameCamelCase: 'SampleAppApi',
        baseNameKebabCase: 'sample-app-api',
        db: ApiPrompts.DB_DYNAMODB_VALUE,
        iac: Prompt.IAC_SAM_VALUE,
        language: ApiPrompts.LANGUAGE_PYTHON37_VALUE,
        provider: Prompt.PROVIDER_AWS_VALUE,
        entities: [
          entity
        ],
      };
      it('creates expected files for given entity configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/components//api-entity'))
          .inTmpDir((dir) => {
            fse.copySync(path.join(__dirname, '../data/templates/sample-app/sample-app-api'), dir);
            fse.copySync(path.join(__dirname, '../data/result-swagger-entity-user.yaml'), path.join(dir, 'specs/specs.yaml'));
          })
          .withOptions({
            action: ConstantsUtils.ACTION_INIT,
            name: 'Users',
          })
          .withPrompts(entity)
          .on('ready',  (gen) => {
            // This is called right before `generator.run()` is calledclear
            generator = gen;
          })
          .then((dir) => {
            if(config.baseNameKebabCase) {
              assert.file(path.join(dir, '.yo-rc.json'));
              assert.jsonFileContent(path.join(dir, '.yo-rc.json'), {"daswag-cli": config});
              FileTools.assertFilesExist(config, dir, '', FileTools.EXPECTED_FILES.apiEntity);
              const targetContent = YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-entity-users.yaml'));
              const sourceContent = YamlUtils.readYaml(path.join(dir, 'specs/specs.yaml'));
              expect(JSON.stringify(sourceContent)).to.be.equal(JSON.stringify(targetContent));
            }
          });
      });
    });
  });
});
