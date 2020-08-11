import { readFileSync, statSync, readdir, existsSync } from 'fs';
import { join as pathJoin } from 'path';
import { LocaleDicionary } from "./locale.dictionary";
import { LocaleFile } from "./locale.file";
import { LocaleConfig } from "./locale.config";
import { LocaleError } from './locale.error';
import { LocaleEnum } from './locale.enum';

export class LocaleFileService {

  private files: LocaleFile[];

  constructor(private readonly config: LocaleConfig) { }

  async getDictionaries(): Promise<LocaleDicionary[]> {
    if(!this.files) {
      this.files = await this.fetchDictionaries();
    }
    return this.files.map(c => c.content);
  }

  private async fetchDictionaries(): Promise<LocaleFile[]> {
    return await this.scanDirectory(this.config.dictionaryPath);
  }

  private async scanDirectory(path: string): Promise<LocaleFile[]> {
    return new Promise((resolve) => {
      if(!existsSync(path)) {
        LocaleError.print(`Directory "${path}" not found.`);
        resolve([]);
        return;
      }
      readdir(path, async (error, entries: string[]) => {
        if(error) {
          LocaleError.print(error.message);
          resolve([]);
          return;
        }
        const localeFiles = [];
        for await (const entry of entries) {
          const entryName = pathJoin(path, entry);
          const entryInfo = statSync(entryName);
          if(entryInfo.isDirectory()) {
            const directoryFiles = await this.scanDirectory(entryName);
            localeFiles.push(...directoryFiles);
            continue;
          }
          if(entryName.indexOf('.json')) {
            const fileContent = readFileSync(entryName, { encoding: 'utf8' });
            const locale = entryName.split('.')[0] as LocaleEnum;
            const dictionary = new LocaleDicionary(locale, JSON.parse(fileContent));
            localeFiles.push(new LocaleFile(entryName, dictionary));
          }
        }
        resolve(localeFiles);
      })
    });
  }

}