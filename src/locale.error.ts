export class LocaleError {
  static print(message: string): void {
    console.log('\x1b[31m%s\x1b[0m: ', '[LocaleModule] Error', message);
  }
}
