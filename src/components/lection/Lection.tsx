import type { Word } from "../../env";
import { ButtonSelectForm } from "./forms/ButtonSelectForm";
import { useState, useEffect } from "preact/hooks";
import { InputForm } from "./forms/InputForm";
import { addStreak, setStreak } from "../../lib/streak";
import { updateEstimatedCount } from "../../lib/count";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getInputType, getStrategy, Settings } from "./Settings";

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
      toast.success(`You've completed chunk ${currentChunkIndex + 1}! 🎉`);

      if (currentChunkIndex + 1 < chunks.length) {
        setCurrentChunkIndex((prev) => prev + 1);
        setCorrectCount(0);
      } else {
        toast.success("You have completed the lection!");
      }
    }

    addStreak(1);
  }

  function handleIncorrect(word: Word, strategy: string) {
    navigator.vibrate(200);

    if (strategy === "de-sk") {
      toast.error(
        `The translation of ${word.singular} is ${word.translation.singular.join(" or ")}`,
      );
    } else {
      toast.error(
        `The translation of ${word.translation.singular.join(" or ")} is ${word.articles.join("/") + " "}${word.singular}`,
      );
    }

    setCorrectCount(0);

    setStreak(0);
  }

  const mainWord = currentChunk[correctCount]!;
  const others = getRandomOthers(data, [mainWord], 4);

  let inputType = getInputType();
  inputType =
    inputType === "both"
      ? Math.random() < 0.5
        ? "buttons"
        : "inputs"
      : inputType;

  let strategy = getStrategy();
  strategy =
    strategy === "both" ? (Math.random() < 0.5 ? "sk-de" : "de-sk") : strategy;

  updateEstimatedCount(correctCount, currentChunkIndex + 1, chunks);

  return (
    <>
      <ToastContainer position="bottom-right" theme="dark" autoClose={5000} />
      <h1 className="text-4xl font-bold mb-5">
        {strategy === "sk-de"
          ? mainWord.translation.singular[0]
          : `${mainWord.articles.length > 0 ? mainWord.articles.join("/") + " " : ""}
        ${mainWord.singular}`}
      </h1>

      {inputType === "buttons" ? (
        <ButtonSelectForm
          key={mainWord.singular}
          main={mainWord}
          others={others}
          strategy={strategy}
          onCorrect={handleCorrect}
          onIncorrect={() => handleIncorrect(mainWord, strategy)}
        />
      ) : (
        <InputForm
          key={mainWord.singular}
          main={mainWord}
          strategy={strategy}
          onCorrect={handleCorrect}
          onIncorrect={() => handleIncorrect(mainWord, strategy)}
        />
      )}

      <Settings />
    </>
  );
}
