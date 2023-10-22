import { DictionarySettings } from "./settings";
import {
  select_random_word,
  reset_buttons,
  update_and_rerender_streak,
  update_estimated_count,
} from "./utils";

const audio = new Audio("/audio/correct.wav");

let streak = 0;

let give_word_again = false;

document.addEventListener("astro:page-load", () => {
  const url = new URL(window.location.href);
  if (!url.pathname.includes("lektion")) return;

  DictionarySettings.load();

  window.words = [...dictionary];
  update_estimated_count();

  streak = localStorage.getItem("streak")
    ? parseInt(localStorage.getItem("streak")!)
    : 0;
  update_and_rerender_streak(streak);

  document
    .querySelectorAll("#option-1, #option-2, #option-3, #option-4")
    .forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.remove("border-[#FFA500]");
        element.classList.remove("hover:bg-[#FFA500]/40");

        if (element.getAttribute("data-correct") === "true") {
          audio.pause();
          audio.currentTime = 0;

          audio.play();

          element.classList.add("bg-green-500");
          element.classList.add("border-[#10B981]");

          streak++;
          update_and_rerender_streak(streak);

          if (!give_word_again) {
            words = words.filter(
              (word) => word.word !== element.getAttribute("data-word"),
            );
          }

          give_word_again = false;

          update_estimated_count();

          setTimeout(() => {
            select();
          }, 500);
        } else {
          element.classList.add("bg-red-500");
          element.classList.add("border-[#EF4444]");

          streak = 0;
          update_and_rerender_streak(streak);

          give_word_again = true;
        }
      });
    });

  select();
});

let last_type = 0;
let same_type = 0;

function select() {
  const random = Math.floor(Math.random() * 100) % 2;
  if (DictionarySettings.getTranslationDirection() === "sk->de") {
    select_sk2de();
    return;
  } else if (DictionarySettings.getTranslationDirection() === "de->sk") {
    select_de2sk();
    return;
  }

  if (same_type >= 3) {
    if (last_type === 0) select_sk2de();
    else select_de2sk();
    return;
  }

  if (random === 0) select_de2sk();
  else select_sk2de();
}

function select_de2sk() {
  if (last_type === 0) same_type++;
  else {
    same_type = 0;
    last_type = 0;
  }

  // reset
  reset_buttons();

  const { options, correct } = select_random_word();

  document.getElementById("word")!.innerText = correct.word;

  for (const option of options) {
    const button = document.getElementById(
      `option-${options.indexOf(option) + 1}`,
    )!;
    button.innerText = option.translation;

    if (option.word === correct.word) {
      button.setAttribute("data-correct", "true");
      button.setAttribute("data-word", correct.word);
    }
  }
}

function select_sk2de() {
  if (last_type === 1) same_type++;
  else {
    same_type = 0;
    last_type = 1;
  }

  // reset
  reset_buttons();

  const { options, correct } = select_random_word();

  document.getElementById("word")!.innerText = correct.translation;

  for (const option of options) {
    const button = document.getElementById(
      `option-${options.indexOf(option) + 1}`,
    )!;
    button.innerText = option.word;

    if (option.word === correct.word) {
      button.setAttribute("data-correct", "true");
      button.setAttribute("data-word", correct.word);
    }
  }
}
