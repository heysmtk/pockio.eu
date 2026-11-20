// Ovládání terminálu. Zatím jen zapíná vstupní řádek; zbytek přibude v dalších krocích.
export {};

const promptEl = document.querySelector<HTMLElement>('[data-prompt]');
if (promptEl) promptEl.hidden = false;
