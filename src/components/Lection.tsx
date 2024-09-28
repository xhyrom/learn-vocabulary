import { type CollectionEntry } from "astro:content";

interface Props {
  data: CollectionEntry<"direkt">;
}

export default function Lection({ data }: Props) {
  console.log(data);

  return (
    <div>
      <h1>Lection</h1>
      {data.map((e) => e.singular)}
    </div>
  );
}
