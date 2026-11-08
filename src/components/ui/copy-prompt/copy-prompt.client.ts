import { mount } from "@cloudflare/nimbus-docs/client";

const RESET_MS = 2000;

function initCopyPrompt(root: HTMLElement): () => void {
  const button = root.querySelector<HTMLButtonElement>("button");
  const text = root.querySelector<HTMLElement>("[data-nb-copy-prompt-text]");
  const idle = root.querySelector<HTMLElement>("[data-nb-copy-prompt-idle]");
  const done = root.querySelector<HTMLElement>("[data-nb-copy-prompt-done]");
  if (!button || !text || !idle || !done) return () => {};

  let resetTimer: number | undefined;

  // `invisible` (visibility: hidden) also drops the inactive label from the
  // accessibility tree, so the button's accessible name follows the swap.
  function show(copied: boolean) {
    idle!.classList.toggle("invisible", copied);
    done!.classList.toggle("invisible", !copied);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text!.textContent ?? "");
    } catch {
      // Clipboard unavailable (insecure context) or permission denied.
      return;
    }
    show(true);
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => show(false), RESET_MS);
  }

  button.addEventListener("click", handleCopy);

  return () => {
    if (resetTimer) window.clearTimeout(resetTimer);
    button.removeEventListener("click", handleCopy);
  };
}

mount("[data-nb-copy-prompt]", initCopyPrompt);
