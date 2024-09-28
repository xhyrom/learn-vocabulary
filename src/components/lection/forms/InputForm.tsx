import type { JSX } from "preact/jsx-runtime";
import { Button } from "./ButtonSelectForm";
import type { FormProps } from "./Form";
import { useRef, useEffect } from "preact/hooks";

function normalizeString(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function InputForm({
  main,
  strategy,
  onCorrect,
  onIncorrect,
}: FormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  const handleValidation = () => {
    const inputValue = (
      document.getElementById("inputField") as HTMLInputElement
    ).value.trim();

    if (strategy === "sk-de") {
      if (
        (main.articles.length > 0 &&
          main.articles
            .map((article) => `${article} ${main.singular}`)
            .some(
              (w) => normalizeString(w) === normalizeString(inputValue.trim()),
            )) ||
        (normalizeString(main.singular) ===
          normalizeString(inputValue.trim()) &&
          main.articles.length === 0)
      ) {
        onCorrect();
      } else {
        onIncorrect();
      }
    } else if (strategy === "de-sk") {
      if (
        main.translation.singular.some(
          (t) => normalizeString(t) === normalizeString(inputValue),
        )
      ) {
        onCorrect();
      } else {
        onIncorrect();
      }
    }
  };

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleValidation();
    }
  };

  return (
    <div className="flex flex-col items-start gap-5">
      <input
        type="text"
        autocomplete={"off"}
        id="inputField"
        ref={inputRef}
        className="w-full p-2 border border-gray-300 rounded-md text-black"
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleValidation}>Submit</Button>
    </div>
  );
}
