export interface DictionarySettings {
  translation_direction: "sk->de" | "de->sk" | "both";
  word_form: "singular" | "plural" | "both";
  type: "select" | "input" | "both";
}

export class DictionarySettings {
  static #translation_direction: DictionarySettings["translation_direction"];
  static #word_form: DictionarySettings["word_form"];
  static #type: DictionarySettings["type"];

  static setTranslationDirection(
    direction: DictionarySettings["translation_direction"],
  ) {
    this.#translation_direction = direction;
  }

  static getTranslationDirection() {
    return this.#translation_direction;
  }

  static setWordForm(form: DictionarySettings["word_form"]) {
    this.#word_form = form;
  }

  static getWordForm() {
    return this.#word_form;
  }

  static setType(type: DictionarySettings["type"]) {
    this.#type = type;
  }

  static getType() {
    return this.#type;
  }

  static save() {
    localStorage.setItem(
      "dictionary_settings",
      JSON.stringify({
        translation_direction: this.#translation_direction,
        word_form: this.#word_form,
        type: this.#type,
      }),
    );
  }

  static load() {
    const settings = localStorage.getItem("dictionary_settings");

    if (settings) {
      const parsedSettings = JSON.parse(settings);
      this.#translation_direction =
        parsedSettings.translation_direction ?? "both";
      this.#word_form = parsedSettings.word_form ?? "singular";
      this.#type = parsedSettings.type ?? "both";
    }
  }
}
