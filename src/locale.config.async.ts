import { ModuleMetadata, FactoryProvider } from '@nestjs/common/interfaces';
import { LocaleConfig } from './locale.config';

export interface LocaleConfigAsync extends Pick<ModuleMetadata, 'imports'>, Pick<FactoryProvider, 'inject'> {
  useFactory: (...args: any[]) => Promise<LocaleConfig> | LocaleConfig;
}
