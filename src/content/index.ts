import { z, defineCollection } from "astro:content";

const direktCollection = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      singular: z.string(),
      plural: z.string().optional().nullable(),
      articles: z.array(z.string()),
      translation: z.object({
        singular: z.array(z.string()),
        plural: z.string().optional().nullable(),
      }),
    }),
  ),
});

export const collections = {
  "direkt-interaktiv-1": direktCollection,
};
