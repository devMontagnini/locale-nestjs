import { readFileSync, statSync, readdir, existsSync } from 'fs';
import { extname, join as pathJoin } from 'path';
import { LocaleDicionary } from "./locale.dictionary";
import { LocaleFile } from "./locale.file";
import { LocaleError } from './locale.error';
import { LocaleEnum } from './locale.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocaleFileService {

  private files: LocaleFile[];

  constructor(private readonly dictionaryPath: string) { }

  async getDictionaries(): Promise<LocaleDicionary[]> {
    if(!this.files) {
      this.files = await this.fetchDictionaryFiles();
    }
    return this.files.map(c => c.dictionary);
  }

  private async fetchDictionaryFiles(): Promise<LocaleFile[]> {
    return await this.scanDirectory(this.dictionaryPath);
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
        const localeFiles: LocaleFile[] = [];
        for await (const entry of entries) {
          const entryPath = pathJoin(path, entry);
          if(statSync(entryPath).isDirectory()) {
            const directoryFiles = await this.scanDirectory(entryPath);
            localeFiles.push(...directoryFiles);
            continue;
          }
          if(extname(entryPath)?.toLocaleLowerCase() === '.json') {
            try {
              const locale = entry.split('.')[0] as LocaleEnum;
              const fileContent = readFileSync(entryPath, { encoding: 'utf8' });
              const dictionary = new LocaleDicionary(locale, JSON.parse(fileContent));
              localeFiles.push(new LocaleFile(entryPath, dictionary));
            }
            catch(error) {
              LocaleError.print(`Error on read file "${entryPath}": `, error.message);
            }
          }
        }
        resolve(localeFiles);
      })
    });
  }

}