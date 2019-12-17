import * as path from 'path';
import * as helpers from 'yeoman-test';
import {Prompt} from '../../src/generators/core/prompt';
import {ConstantsUtils} from "../../src/utils/constants-utils";

describe('daswag:app', () => {
  context('generate project with a client and an API', () => {
    const dummyApi: helpers.Dependency = [helpers.createDummyGenerator(), 'daswag:api'];
    const dummyClient: helpers.Dependency = [helpers.createDummyGenerator(), 'daswag:client'];
    before(done => {
      helpers
        .run(path.join(__dirname, '../../src/generators/services/app'))
        .inTmpDir(dir => {
          // fse.copySync(path.join(__dirname, '../data/templates/sample-app'), dir);
        })
        .withOptions({
          action: ConstantsUtils.ACTION_INIT
        })
        .withPrompts({
          baseName: 'daSWAG',
          components: ['Api', 'UserMgmt', ' Client'],
          iac: Prompt.IAC_SAM_VALUE,
          provider: Prompt.PROVIDER_AWS_VALUE
        })
        .withGenerators([dummyApi, dummyClient])
        .on('end', done);
    });
  });
});
