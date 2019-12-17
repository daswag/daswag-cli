import * as fse from "fs-extra";
import * as path from 'path';
import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';
import {Base} from "../../src/generators/core/base";
import {Prompt} from "../../src/generators/core/prompt";
import {IApiOptions} from "../../src/generators/model/api-options.model";
import {ApiFiles} from "../../src/generators/services/api/api-files";
import {ApiPrompts} from '../../src/generators/services/api/api-prompts';
import {ConstantsUtils} from "../../src/utils/constants-utils";
import FileTools from "../tools/file-tools";

describe('daswag:api', () => {
  context('generate an API', () => {

    describe('with AWS, Cognito, Monolith, SAM, DynamoDB, Python37 parameters', () => {
      let generator: Base;
      const config : IApiOptions = {
        db: ApiPrompts.DB_DYNAMODB_VALUE,
        iac: Prompt.IAC_SAM_VALUE,
        language: ApiPrompts.LANGUAGE_PYTHON37_VALUE,
        provider: Prompt.PROVIDER_AWS_VALUE
      };
      it('creates expected files for given configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/services/api'))
          .inTmpDir((dir) => {
            fse.copySync(path.join(__dirname, '../data/templates/sample-app'), dir);
          })
          .withOptions({
            action: ConstantsUtils.ACTION_INIT,
            baseName: 'SampleApp',
            iac: Prompt.IAC_SAM_VALUE,
            provider: Prompt.PROVIDER_AWS_VALUE
          })
          .withPrompts(config)
          .on('ready',  (gen) => {
            // This is called right before `generator.run()` is called
            generator = gen;
          })
          .then((dir) => {
            const files = new ApiFiles(generator, config);
            if(config.baseNameKebabCase) {
              assert.file(path.join(dir, path.join(config.baseNameKebabCase, '.yo-rc.json')));
              assert.jsonFileContent(path.join(dir, config.baseNameKebabCase, '.yo-rc.json'), {"daswag-cli": config});
              FileTools.assertFilesExist(config, dir, config.baseNameKebabCase, FileTools.EXPECTED_FILES.api);
            }
          });
      });
    });
  });
});
