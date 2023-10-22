import { z, defineCollection } from "astro:content";

const dictionaryCollection = defineCollection({
  type: "data",
  schema: z.object({
    id: z.number(),
    words: z.array(
      z.object({
        word: z.string(),
        article: z.string().or(z.null()).or(z.array(z.string())),
        translation: z.string().or(
          z.object({
            singular: z.string(),
            plural: z.string().or(z.null()),
          }),
        ),
        plural: z.string().optional(),
      }),
    ),
  }),
});

export const collections = {
  dictionary: dictionaryCollection,
};
