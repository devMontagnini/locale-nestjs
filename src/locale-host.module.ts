import { Module, Global, DynamicModule } from "@nestjs/common";
import { LocaleEnum } from "./locale.enum";
import { LocaleService } from "./locale.service";
import { LocaleFileService } from "./locale.file.service";
import { LocaleConfig } from "./locale.config";
import { LocaleConfigAsync } from "./locale.config.async";
import { LOCALE_CONFIG_TOKEN, LOCALE_SERVICE_TOKEN, LOCALE_SERVICE_FILE_TOKEN } from "./constants";

@Global()
@Module({
  providers: [
    {
      provide: LOCALE_SERVICE_FILE_TOKEN,
      useFactory: (config: LocaleConfig) => {
        return new LocaleFileService(config.dictionaryPath);
      },
      inject: [LOCALE_CONFIG_TOKEN],
    },
    {
      provide: LOCALE_SERVICE_TOKEN,
      useClass: LocaleService,
    }
  ],
  exports: [LOCALE_SERVICE_TOKEN]
})
export class LocaleHostModule {

  private static defaultConfig: LocaleConfig = {
    dictionaryPath: './src/dictionaries', 
    defaultLocale: LocaleEnum.en 
  }

  static forRoot(config?: LocaleConfig): DynamicModule {
    config = config || LocaleHostModule.defaultConfig;
    return {
      module: LocaleHostModule,
      providers: [{
        provide: LOCALE_CONFIG_TOKEN,
        useValue: config,
      }]
    }
  }

  static forRootAsync(config?: LocaleConfigAsync): DynamicModule {
    return {
      module: LocaleHostModule,
      imports: config?.imports,
      providers: [{
        provide: LOCALE_CONFIG_TOKEN,
        useFactory: config ? config.useFactory : () => LocaleHostModule.defaultConfig,
        inject: config?.inject,
      }]
    }
  }

}