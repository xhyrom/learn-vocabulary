interface Word {
  word: string;
  article: string | null;
  translation:
    | string
    | {
        singular: string;
        plural: string;
      };
  plural?: string;
}
declare const words: Word[];

const audio = new Audio("/audio/correct.wav");

let streak = 0;

document.addEventListener("astro:page-load", () => {
  const url = new URL(window.location.href);
  if (!url.pathname.includes("lektion")) return;

  streak = localStorage.getItem("streak")
    ? parseInt(localStorage.getItem("streak")!)
    : 0;
  update_and_rerender_streak();

  document
    .querySelectorAll("#option-1, #option-2, #option-3, #option-4")
    .forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.remove("border-[#FFA500]");
        if (element.getAttribute("data-correct") === "true") {
          audio.pause();
          audio.currentTime = 0;

          audio.play();

          element.classList.add("bg-green-500");
          element.classList.add("border-[#10B981]");

          streak++;
          update_and_rerender_streak();

          setTimeout(() => {
            select();
          }, 500);
        } else {
          element.classList.add("bg-red-500");
          element.classList.add("border-[#EF4444]");

          streak = 0;
          update_and_rerender_streak();
        }
      });
    });

  select();
});

function update_and_rerender_streak() {
  localStorage.setItem("streak", streak.toString());
  document.getElementById("streak")!.innerText = `streak: ${streak.toString()}`;
}

let last_type = 0;
let same_type = 0;

function select() {
  const random = Math.floor(Math.random() * 100) % 2;

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
  document
    .querySelectorAll("#option-1, #option-2, #option-3, #option-4")
    .forEach((element) => {
      element.classList.remove("bg-green-500");
      element.setAttribute("data-correct", "false");
      element.classList.remove("border-[#10B981]");
      element.classList.remove("bg-red-500");
      element.classList.remove("border-[#EF4444]");
      element.classList.add("border-[#FFA500]");
    });

  const set: Set<Word> = new Set();
  while (set.size < 4) {
    set.add(words[Math.floor(Math.random() * 100) % words.length]!);
  }
  const options: Word[] = Array.from(set);
  const correct: Word =
    options[Math.floor(Math.random() * 100) % options.length]!;

  document.getElementById("word")!.innerText = correct.word;

  for (const option of options) {
    const button = document.getElementById(
      `option-${options.indexOf(option) + 1}`,
    )!;
    button.innerText =
      typeof option.translation === "string"
        ? option.translation
        : option.translation.singular;

    if (
      option.word === correct.word ||
      (typeof option.translation === "string"
        ? option.translation
        : option.translation.singular) === correct.word
    )
      button.setAttribute("data-correct", "true");
  }
}

function select_sk2de() {
  if (last_type === 1) same_type++;
  else {
    same_type = 0;
    last_type = 1;
  }

  // reset
  document
    .querySelectorAll("#option-1, #option-2, #option-3, #option-4")
    .forEach((element) => {
      element.classList.remove("bg-green-500");
      element.classList.remove("border-[#10B981]");
      element.classList.remove("bg-red-500");
      element.classList.remove("border-[#EF4444]");
      element.classList.add("border-[#FFA500]");
    });

  const set: Set<Word> = new Set();
  while (set.size < 4) {
    set.add(words[Math.floor(Math.random() * 100) % words.length]!);
  }
  const options: Word[] = Array.from(set);
  const correct: Word =
    options[Math.floor(Math.random() * 100) % options.length]!;

  document.getElementById("word")!.innerText =
    typeof correct.translation === "string"
      ? correct.translation
      : correct.translation.singular;

  for (const option of options) {
    const button = document.getElementById(
      `option-${options.indexOf(option) + 1}`,
    )!;
    button.innerText = option.word;

    if (
      option.word === correct.word ||
      (typeof option.translation === "string"
        ? option.translation
        : option.translation.singular) === correct.word
    )
      button.setAttribute("data-correct", "true");
  }
}
