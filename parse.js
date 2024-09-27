var lol = [];
listItems.forEach((item) => {
  let term = item.querySelector(".term").textContent.trim();
  let definition = item.querySelector(".definition").textContent.trim();

  let articles = [];
  let singular = term;
  let plural = "";
  let translation = "";

  if (["der", "die", "das"].some((a) => term.startsWith(a))) {
    let b = term.split(" ")[0];
    articles = b.split("/");
    singular = singular.slice(b.length + 1);

    if (singular.includes(", ")) {
      plural = singular.split(", ").at(-1);
      if (plural) {
        singular = singular.replace(plural, "").slice(0, -2);
      }
    }
  }

  translation = definition;
  lol.push({
    singular,
    plural: plural,
    articles,
    translation: {
      singular: translation,
      plural: null,
    },
  });
});
