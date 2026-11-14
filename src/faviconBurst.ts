export async function faviconBurst(signal: AbortSignal) {
  await document.fonts.load('16px "Favicon Easter Egg"', "gG");
  await new Promise((resolve) => setTimeout(resolve, 320));
  if (signal.aborted) return;
  document.documentElement.classList.add("favicon-letters");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Animate separate decorative copies; React keeps ownership of all text.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const positions: DOMRect[] = [];
  while (walker.nextNode() && positions.length < 150) {
    const node = walker.currentNode as Text;
    if (
      node.parentElement?.closest(
        'script, style, .sr-only, [aria-hidden="true"]',
      )
    )
      continue;
    for (const match of node.data.matchAll(/[gG]/g)) {
      const range = document.createRange();
      range.setStart(node, match.index!);
      range.setEnd(node, match.index! + 1);
      const rect = range.getBoundingClientRect();
      if (
        rect.width &&
        rect.bottom > 0 &&
        rect.top < innerHeight &&
        rect.right > 0 &&
        rect.left < innerWidth
      )
        positions.push(rect);
    }
  }
  positions.forEach((rect, index) => {
    const icon = document.createElement("img");
    icon.src = "/favicon.svg";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    icon.className = "favicon-pop";
    const size = rect.width * 0.92;
    Object.assign(icon.style, {
      left: `${rect.left}px`,
      top: `${rect.top + rect.height - size - 2}px`,
      width: `${size}px`,
      height: `${size}px`,
    });
    document.body.appendChild(icon);
    const animation = icon.animate(
      [
        { transform: "scale(.15) rotate(-18deg)", opacity: 0 },
        { transform: "scale(1.8) rotate(9deg)", opacity: 1, offset: 0.45 },
        { transform: "scale(1) rotate(0deg)", opacity: 0 },
      ],
      {
        duration: 520,
        delay: (index * 18) % 180,
        easing: "cubic-bezier(.2,.75,.3,1)",
        fill: "both",
      },
    );
    const remove = () => {
      animation.cancel();
      icon.remove();
    };
    signal.addEventListener("abort", remove, { once: true });
    animation.finished
      .then(() => {
        icon.remove();
        signal.removeEventListener("abort", remove);
      })
      .catch(() => {});
  });
}

