import { LocaleEnum } from "./locale.enum";

export class LocaleDicionary {
  public readonly language: string;
  public readonly country: string;
  constructor(
    public readonly locale: LocaleEnum,
    private readonly messages: { [code: string]: string }
  ){
    const localeParts = this.locale.split('-');
    this.language = localeParts[0];
    this.country = localeParts[1];
  }

  getMessage(code: string, params?: { [paramKey: string]: string }): string {
    let value = this.messages[code];
    if (params) {
      Object.keys(params).forEach(key => {
        value = value.replace(new RegExp(`{${key}}`), params[key]);
      });
    }
    return value;
  }
}