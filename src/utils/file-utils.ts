import * as fse from 'fs-extra';
import LoggerUtils from './logger-utils';

export default class FileUtils {

  public static logger = LoggerUtils.createLogger('FileUtils');

  /**
   * Checks the file exists.
   * @param file the file to check.
   * @returns {boolean} whether the file exists and is actually a file.
   */
  public static doesFileExist(file: string): boolean {
    const statObject = FileUtils.getStatObject(file);
    return statObject && statObject.isFile();
  }

  /**
   * Checks the directory exists.
   * @param directory the directory to check.
   * @returns {boolean} whether the directory exists and is actually a directory.
   */
  public static doesDirectoryExist(directory: string): boolean {
    const statObject = FileUtils.getStatObject(directory);
    return statObject && statObject.isDirectory();
  }

  /**
   * Creates a directory, if it doesn't exist already.
   * @param directory the directory to create.
   * @throws WrongDirException if the directory to create exists and is a file.
   */
  public static createDirectory(directory: string) {
    if (!directory) {
      throw new Error('A directory must be passed to be created.');
    }
    const statObject = FileUtils.getStatObject(directory);
    if (statObject && statObject.isFile()) {
      throw new Error(`The directory to create '${directory}' is a file.`);
    }
    fse.ensureDirSync(directory);
  }

  private static getStatObject(file: string) {
    try {
      return fse.statSync(file);
    } catch (error) {
      return false;
    }
  }
}
