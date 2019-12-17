import {expect} from "chai";
import * as fse from "fs-extra";
import * as path from 'path';
import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';
import {Base} from '../../src/generators/core/base';
import {Prompt} from '../../src/generators/core/prompt';
import {IApiOptions, IApiResourceOptions} from '../../src/generators/model/api-options.model';
import {ApiFiles} from '../../src/generators/services/api/api-files';
import {ApiPrompts} from '../../src/generators/services/api/api-prompts';
import {ConstantsUtils} from '../../src/utils/constants-utils';
import {YamlUtils} from '../../src/utils/yaml-utils';
import FileTools from '../tools/file-tools';

describe('daswag:api-resource', () => {
  context('generate an API Resource', () => {
    describe('with default parameters', () => {
      let generator: Base;
      const resource : IApiResourceOptions = {
        name: "users",
        path: "/users",
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
          resource
        ],
      };
      it('creates expected files for given entity configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/components/api-resource'))
          .inTmpDir((dir) => {
            fse.copySync(path.join(__dirname, '../data/templates/sample-app/sample-app-api'), dir);
            fse.copySync(path.join(__dirname, '../data/init-swagger.yaml'), path.join(dir, 'specs/specs.yaml'));
          })
          .withOptions({
            action: ConstantsUtils.ACTION_INIT,
            name: 'users',
          })
          .withPrompts(resource)
          .on('ready',  (gen) => {
            // This is called right before `generator.run()` is calledclear
            generator = gen;
          })
          .then((dir) => {
            const files = new ApiFiles(generator, config);
            if(config.baseNameKebabCase) {
              assert.file(path.join(dir, '.yo-rc.json'));
              assert.jsonFileContent(path.join(dir, '.yo-rc.json'), {"daswag-cli": config});
              FileTools.assertFilesExist(config, dir, '', FileTools.EXPECTED_FILES.apiResource);
              const targetContent = YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-resource.yaml'));
              const sourceContent = YamlUtils.readYaml(path.join(dir, 'specs/specs.yaml'));
              expect(JSON.stringify(sourceContent)).to.be.equal(JSON.stringify(targetContent));
            }
          });
      });
    });
  });
});
