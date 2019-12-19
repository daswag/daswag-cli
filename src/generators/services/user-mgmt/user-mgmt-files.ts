import {Base} from "../../core/base";
import File from '../../core/file';
import {IOptions} from "../../model/options.model";

export class UserMgmtFiles extends File {

  private static USER_MGMT_PATH = '../../../templates/user-mgmt/';

  constructor(generator: Base, options: IOptions) {
    super(generator, options, UserMgmtFiles.USER_MGMT_PATH);
  }

  public files() {
    return {
      ...this.userMgmtCommonFiles(),
    }
  }

  private userMgmtCommonFiles() {
    return {
      common: [
        {
          templates: [
            'Makefile.ejs',
            'README.md.ejs',
            'template.yaml.ejs'
          ]
        }
      ]
    };
  }

}
