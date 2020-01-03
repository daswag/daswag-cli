import * as Generator from "yeoman-generator";
import {Prompt} from '../../core/prompt';
import {IEntitySchema} from "../../model/options.model";

export class ApiEntityPrompts extends Prompt  {

  public async askForUpdatedEntities(entities: IEntitySchema[] | undefined): Promise<Generator.Answers> {
    const entityChoices : any = [];
    if(entities) {
      entities.forEach((entity: IEntitySchema) => {
        entityChoices.push({name: entity.nameCamelCase, value: entity.nameCamelCase});
      });
    }
    return this.generator.prompt([{
      choices: entityChoices,
      message: `Which entities would you like to update?`,
      name: 'updatedEntities',
      type: 'checkbox',
    }]);
  }
}
