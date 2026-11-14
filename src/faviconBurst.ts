import { playPop } from "./audio";

export async function faviconBurst(signal: AbortSignal) {
  await document.fonts.load('16px "Favicon Easter Egg"', "gG");
  if (signal.aborted) return;
  document.documentElement.classList.add("favicon-letters");
  playPop();
}
