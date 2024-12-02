import type { JSX } from "preact/jsx-runtime";
import type { Word } from "../../../env";
import type { FormProps } from "./Form";

export interface ButtonSelectProps extends FormProps {
  others: Word[];
}

export function Button({
  onClick,
  children,
  href,
}: {
  onClick?: (e: JSX.TargetedMouseEvent<HTMLElement>) => void;
  children: JSX.Element | string;
  href?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={
        "cursor-pointer broder-1 duration-400 flex items-center justify-center gap-x-3 rounded-lg border border-[#FFA500] bg-[#FFA500]/25 px-10 py-3 text-lg font-semibold text-white transition-colors ease-out hover:bg-[#FFA500]/40"
      }
    >
      {children}
    </a>
  );
}

export function ButtonSelectForm({
  main,
  others,
  strategy,
  onCorrect,
  onIncorrect,
}: ButtonSelectProps) {
  const buttons = [main, ...others]
    .sort(() => Math.random() - 0.5)
    .map((word) => (
      <Button
        onClick={(e) =>
          validate(e, { main, others, strategy, onCorrect, onIncorrect })
        }
      >
        {strategy === "sk-de"
          ? `${word.articles.join("/") + " "}${word.singular!}`
          : word.translation.singular[0]!}
      </Button>
    ));

  return <div className="flex flex-wrap justify-center gap-6">{buttons}</div>;
}

function validate(
  event: JSX.TargetedMouseEvent<HTMLElement>,
  props: ButtonSelectProps,
) {
  event.currentTarget.classList.remove("border-[#FFA500]");
  event.currentTarget.classList.remove("hover:bg-[#FFA500]/40");

  switch (props.strategy) {
    case "sk-de":
      if (
        (props.main.articles.length > 0 &&
          props.main.articles
            .map((article) => `${article} ${props.main.singular}`)
            .some((w) => w === event.currentTarget.textContent?.trim())) ||
        `${props.main.articles.join("/")} ${props.main.singular}` ===
          event.currentTarget.textContent?.trim() ||
        event.currentTarget.textContent?.trim() === props.main.singular.trim()
      ) {
        props.onCorrect();

        event.currentTarget.classList.add("bg-green-500");
        event.currentTarget.classList.add("border-[#10B981]");
      } else {
        props.onIncorrect();

        event.currentTarget.classList.add("bg-red-500");
        event.currentTarget.classList.add("border-[#EF4444]");
      }
      break;
    case "de-sk":
      if (
        props.main.translation.singular.some(
          (t) => t === event.currentTarget.textContent?.trim(),
        )
      ) {
        props.onCorrect();

        event.currentTarget.classList.add("bg-green-500");
        event.currentTarget.classList.add("border-[#10B981]");
      } else {
        props.onIncorrect();

        event.currentTarget.classList.add("bg-red-500");
        event.currentTarget.classList.add("border-[#EF4444]");
      }
      break;
  }
}
