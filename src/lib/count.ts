import type { Word } from "../env";

export function updateEstimatedCount(
  correctCount: number,
  currentChunk: number,
  chunks: Word[][],
) {
  const element = document.getElementById("count");

  const wordsGuessed = correctCount + (currentChunk - 1) * 5;
  const wordsTotal = chunks.reduce((acc, chunk) => acc + chunk.length, 0);

  if (element)
    element.innerText = `count: ${wordsGuessed}/${wordsTotal} (${currentChunk}/${chunks.length}) (${Math.round(
      (wordsGuessed / wordsTotal) * 100,
    )}%)`;
}
