import { Module, DynamicModule } from "@nestjs/common";
import { LocaleService } from "./locale.service";
import { LocaleInterceptor } from "./locale.interceptor";
import { LocaleConfig } from "./locale.config";
import { LocaleConfigAsync } from "./locale.config.async";
import { LocaleHostModule } from "./locale-host.module";
import { LOCALE_SERVICE_TOKEN } from "./constants";

@Module({
  providers: [
    {
      provide: LocaleService,
      useExisting: LOCALE_SERVICE_TOKEN,
    },
    LocaleInterceptor,
  ],
  exports: [
    LocaleService,
    LocaleInterceptor
  ]
})
export class LocaleModule {
  static forRoot(config?: LocaleConfig): DynamicModule {
    return {
      module: LocaleModule,
      imports: [LocaleHostModule.forRoot(config)],
    };
  }

  static forRootAsync(config?: LocaleConfigAsync): DynamicModule {
    return {
      module: LocaleModule,
      imports: [LocaleHostModule.forRootAsync(config)],
    }
  }
 }