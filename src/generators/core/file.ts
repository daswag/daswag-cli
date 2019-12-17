import * as path from "path";
import {IOptions} from "../model/options.model";
import {Base} from "./base";

export default abstract class File {

  protected constructor(public generator: Base, public options: any, public templatePath: string) {}

  public writeFiles() {
    const startTime = new Date();
    const files = this.files();

    // Iterate over files
    for (let i = 0, blocks = Object.keys(files); i < blocks.length; i++) {
      for (let j = 0, blockTemplates = files[blocks[i]]; j < blockTemplates.length; j++) {
        const blockTemplate = blockTemplates[j];
        if (!blockTemplate.condition || blockTemplate.condition(this.options)) {
          this.generator.sourceRoot(path.join(__dirname, this.templatePath, blockTemplate.path ? blockTemplate.path : ''));
          blockTemplate.templates.forEach((templateObj: any) => {
            let templatePath = '';
            let templatePathTo = '';
            if (typeof templateObj === 'string') {
              templatePath += templateObj;
            } else if (typeof templateObj.file === 'string') {
                templatePath += templateObj.file;
            }
            templatePathTo =  templateObj && templateObj.renameTo ? templateObj.renameTo : templatePath.replace('.ejs', '');
            this.generator.fs.copyTpl(
              this.generator.templatePath(templatePath),
              this.generator.destinationPath(templatePathTo),
              this.options
            );
          });

        }
      }
    }

    const endTime = new Date();
    this.generator.logger.debug(`Time taken to write files: ${endTime.getTime() - startTime.getTime()}ms`);
  }

  public abstract files(): any;

}
