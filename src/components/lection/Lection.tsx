import type { Word } from "../../env";
import { ButtonSelectForm } from "./forms/ButtonSelectForm";
import { useState, useEffect, type Dispatch } from "preact/hooks";
import { InputForm } from "./forms/InputForm";
import { addStreak, setStreak } from "../../lib/streak";
import { updateEstimatedCount } from "../../lib/count";

interface Props {
  data: Word[];
}

function getRandomChunks(data: Word[], chunkSize: number) {
  const shuffled = data.sort(() => Math.random() - 0.5);
  const chunks = [];
  for (let i = 0; i < shuffled.length; i += chunkSize) {
    chunks.push(shuffled.slice(i, i + chunkSize));
  }
  return chunks;
}

function getRandomOthers(data: Word[], exclude: Word[], count: number) {
  const filtered = data.filter((word) => !exclude.includes(word));
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const audio = new Audio("/audio/correct.wav");

function handleIncorrect(setCorrectCount: Dispatch<SetStateAction<number>>) {
  navigator.vibrate(200);
  setCorrectCount(0);

  setStreak(0);
}

export default function Lection({ data }: Props) {
  const [chunks, _] = useState(() => getRandomChunks(data, 5));
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(chunks[0]!);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setCurrentChunk(chunks[currentChunkIndex]!);
  }, [currentChunkIndex, chunks]);

  async function handleCorrect() {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.2;
    audio.play();

    await new Promise((resolve) => setTimeout(resolve, 200));

    setCorrectCount((prev) => prev + 1);

    if (correctCount + 1 === currentChunk.length) {
      if (currentChunkIndex + 1 < chunks.length) {
        setCurrentChunkIndex((prev) => prev + 1);
        setCorrectCount(0);
      } else {
        // All chunks completed
        alert("Congratulations! You've completed all chunks.");
      }
    }

    addStreak(1);
  }

  const mainWord = currentChunk[correctCount]!;
  const others = getRandomOthers(data, [mainWord], 4);

  const isButtonSelectForm = Math.random() < 0.5;

  updateEstimatedCount(correctCount, currentChunkIndex + 1, chunks);

  return (
    <>
      <h1 className="text-6xl font-bold mb-5">
        {mainWord.articles.length > 0 ? mainWord.articles.join("/") + " " : ""}
        {mainWord.singular}
      </h1>
      <p>
        Chunk {currentChunkIndex + 1} of {chunks.length}
      </p>
      <p>Words left: {currentChunk.length - correctCount}</p>

      {isButtonSelectForm ? (
        <ButtonSelectForm
          key={mainWord.singular}
          main={mainWord}
          others={others}
          strategy="de-sk"
          onCorrect={handleCorrect}
          onIncorrect={() => handleIncorrect(setCorrectCount)}
        />
      ) : (
        <InputForm
          key={mainWord.singular}
          main={mainWord}
          strategy="de-sk"
          onCorrect={handleCorrect}
          onIncorrect={() => handleIncorrect(setCorrectCount)}
        />
      )}
    </>
  );
}
