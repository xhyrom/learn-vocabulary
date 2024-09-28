export function setStreak(n: number) {
  localStorage.setItem("streak", String(n));
  rerenderStreak();
}

export function addStreak(n: number) {
  setStreak(getStreak() + n);
}

export function getStreak(): number {
  return parseInt(localStorage.getItem("streak") || "0");
}

export function rerenderStreak() {
  const element = document.getElementById("streak");
  if (element) element.innerText = `streak: ${getStreak()}`;
}
