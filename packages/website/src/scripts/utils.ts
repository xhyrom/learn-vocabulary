export function reset_buttons() {
  document
    .querySelectorAll("#option-1, #option-2, #option-3, #option-4")
    .forEach((element) => {
      element.classList.remove("bg-green-500");

      if (element.hasAttribute("data-correct"))
        element.attributes.removeNamedItem("data-correct");

      if (element.hasAttribute("data-word"))
        element.attributes.removeNamedItem("data-word");

      element.classList.remove("border-[#10B981]");
      element.classList.remove("bg-red-500");
      element.classList.remove("border-[#EF4444]");

      if (!element.classList.contains("border-[#FFA500]"))
        element.classList.add("border-[#FFA500]");

      if (!element.classList.contains("hover:bg-[#FFA500]/40"))
        element.classList.add("hover:bg-[#FFA500]/40");
    });
}

export function update_and_rerender_streak(streak: number) {
  localStorage.setItem("streak", streak.toString());
  document.getElementById("streak")!.innerText = `streak: ${streak.toString()}`;
}

export function update_estimated_count() {
  document.getElementById("count")!.innerText = `count: ${
    dictionary.length - words.length
  }/${dictionary.length} (${(
    ((dictionary.length - words.length) / dictionary.length) *
    100
  ).toFixed(2)}%)`;
}

export function select_random_word() {
  const set: Set<Word> = new Set();
  while (set.size < 3) {
    set.add(dictionary[Math.floor(Math.random() * 100) % dictionary.length]!);
  }

  let options: Word[] = Array.from(set);

  let correct: Word = words[Math.floor(Math.random() * 100) % words.length]!;
  while (options.some((option) => option.word === correct.word)) {
    correct = words[Math.floor(Math.random() * 100) % words.length]!;
  }

  set.add(correct);

  options = Array.from(set);
  options.sort(() => Math.random() - 0.5);

  document.getElementById("word")!.innerText = correct.word;

  return { options, correct };
}
