interface Word {
  word: string;
  article: string | null;
  translation:
    | string
    | {
        singular: string;
        plural: string;
      };
  plural?: string;
}
declare const dictionary: Word[];
declare var words: Word[];
