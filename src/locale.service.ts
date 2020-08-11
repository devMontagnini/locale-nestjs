import { Injectable, OnModuleInit } from "@nestjs/common";
import { LocaleConfig } from "./locale.config";
import { LocaleDicionary } from "./locale.dictionary";
import { LocaleEnum } from "./locale.enum";
import { LocaleFileService } from "./locale.file.service";

@Injectable()
export class LocaleService implements OnModuleInit {

  private definedLocale: LocaleEnum;
  private dictionaries: LocaleDicionary[] = [];

  constructor(
    private readonly config: LocaleConfig,
    private readonly fileService: LocaleFileService,
  ) { }

  async onModuleInit(): Promise<void> {
    this.dictionaries = await this.fileService.getDictionaries();
    if (!this.dictionaries.some(c => c.locale === this.config.defaultLocale)) {
      throw new Error(
        `Dictionary not found for default locale: ${this.config.defaultLocale}`
      );
    }
  }

  defineLanguage(acceptsLanguages: string[]): void {
    let closerLanguage: LocaleEnum;
    for (const accepted of acceptsLanguages) {
      const dicionary = this.dictionaries.find(c => c.locale === accepted);
      if (dicionary) {
        this.definedLocale = dicionary.locale;
        return;
      }
      if (!closerLanguage) {
        const acceptedlanguage = accepted.split('-')[0];
        const matchLanguage = this.dictionaries.filter(c => c.language === acceptedlanguage);
        if (matchLanguage.length) {
          closerLanguage = matchLanguage[0].locale;
        }
      }
    }
    if (closerLanguage)
      this.definedLocale = closerLanguage;
  }

  translate(messageCode: string, params?: { [paramKey: string]: string }): string {
    const locale = this.definedLocale || this.config.defaultLocale;
    const dictionary = this.dictionaries.find(c => c.locale === locale);
    return dictionary.getMessage(messageCode, params);
  }

} 