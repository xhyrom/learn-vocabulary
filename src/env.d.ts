/// <reference path="../.astro/types.d.ts" />

export interface Word {
  singular: string;
  plural: string;
  articles: string[];
  translation: {
    singular: string[];
    plural: string;
  };
}
