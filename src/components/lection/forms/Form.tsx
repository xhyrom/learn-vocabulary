import type { Word } from "../../../env";

export interface FormProps {
  main: Word;
  strategy: "sk-de" | "de-sk";
  onCorrect: () => void;
  onIncorrect: () => void;
}
