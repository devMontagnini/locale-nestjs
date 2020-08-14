import { LocaleDicionary } from "./locale.dictionary";

export class LocaleFile {
  constructor(
    public readonly path: string,
    public readonly dictionary: LocaleDicionary,
  ) { }
}