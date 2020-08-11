import { Module, Global, DynamicModule } from "@nestjs/common";
import { LocaleEnum } from "./locale.enum";
import { LocaleService } from "./locale.service";
import { LocaleFileService } from "./locale.file.service";
import { LocaleConfig } from "./locale.config";
import { LocaleConfigAsync } from "./locale.config.async";
import { LOCALE_CONFIG_TOKEN, LOCALE_SERVICE_TOKEN } from "./constants";

@Global()
@Module({
  providers: [
    LocaleFileService,
    {
      provide: LOCALE_CONFIG_TOKEN,
      useValue: { 
        dictionaryPath: './dictionaries', 
        defaultLocale: LocaleEnum.en 
      }
    },
    {
      provide: LOCALE_SERVICE_TOKEN,
      useClass: LocaleService,
    }
  ],
  exports: [LocaleService]
})
export class LocaleHostModule {

  static forRoot(config?: LocaleConfig): DynamicModule {
    return {
      module: LocaleHostModule,
      providers: !config ? [] : [{
        provide: LOCALE_CONFIG_TOKEN,
        useValue: config,
      }]
    }
  }

  static forRootAsync(config?: LocaleConfigAsync): DynamicModule {
    return {
      module: LocaleHostModule,
      imports: config?.imports,
      providers: !config ? [] : [{
        provide: LOCALE_CONFIG_TOKEN,
        useFactory: config.useFactory,
        inject: config.inject,
      }]
    }
  }

}