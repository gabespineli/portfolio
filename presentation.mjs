const marks = {
  'Node.js': ['node', '#53883f'], Express: ['ex', '#353d35'], Prisma: ['prisma', '#314b50'], TypeScript: ['TS', '#3178c6'], JavaScript: ['JS', '#877600'], CSS: ['CSS', '#663399'],
  Liquid: ['{ }', '#658636'], Shopify: ['S', '#648b31'], 'Next.js': ['N', '#202620'],
  React: ['react', '#25819b'], Supabase: ['bolt', '#28835a'], Tailwind: ['~', '#16849b'],
  MediaPipe: ['vision', '#277e9c'], PostgreSQL: ['PG', '#376787'], Resend: ['Re', '#343b35'], Vercel: ['triangle', '#252e27']
};
export const projectStacks = {
  'out-of-body': ['TypeScript','React','Next.js','Supabase','MediaPipe'],
  cleanhaul: ['TypeScript','React','Next.js','Tailwind','Supabase'],
  talentados: ['TypeScript','Next.js','Express','Prisma','Supabase'],
  'wtp-coffee': ['Liquid','JavaScript','CSS','Shopify']
};
function icon(name) {
  const [mark,color] = marks[name] || [name.slice(0,2),'#426548'];
  const glyph = mark === 'node' ? '<path d="M16 2 29 9v14L16 30 3 23V9Z" fill="none" stroke="currentColor" stroke-width="2"/><text x="16" y="21" text-anchor="middle" font-family="Arial" font-size="14" fill="currentColor">N</text>' : mark === 'prisma' ? '<path d="M18 2 3 25l24 5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m18 2-7 25 16 3" fill="none" stroke="currentColor" stroke-width="2"/>' : mark === 'react' ? '<g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="16" cy="16" rx="14" ry="5"/><ellipse cx="16" cy="16" rx="14" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="5" transform="rotate(120 16 16)"/></g><circle cx="16" cy="16" r="2.5" fill="currentColor"/>'
    : mark === 'bolt' ? '<path fill="currentColor" d="M18 1 4 19h11l-1 12L28 13H17Z"/>'
    : mark === 'triangle' ? '<path fill="currentColor" d="m16 4 14 24H2Z"/>'
    : mark === 'vision' ? '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11V3h8m10 0h8v8m0 10v8h-8M11 29H3v-8"/><circle cx="16" cy="16" r="6"/></g>'
    : `<text x="16" y="22" text-anchor="middle" fill="currentColor" font-family="Arial,sans-serif" font-weight="700" font-size="${mark.length>2?12:20}">${mark}</text>`;
  return `<svg viewBox="0 0 32 32" aria-hidden="true" style="color:${color}">${glyph}</svg>`;
}
export function techStack(id, fan=false) {
  const stack=projectStacks[id]||[];
  if(!stack.length) return '<p class="tech-pending">Project stack · awaiting repository access</p>';
  return `<div class="tech-stack ${fan?'tech-fan':''}" aria-label="Project technologies">${stack.map((name,i)=>`<button type="button" class="tech-tile" style="--order:${i};--tilt:${(i-(stack.length-1)/2)*9}deg;--lift:${Math.abs(i-(stack.length-1)/2)*5}px" aria-label="${name}" title="${name}">${icon(name)}<span class="tech-tooltip">${name}</span></button>`).join('')}<span class="tech-caption" aria-hidden="true">${fan?'Project technologies':'Built with'}</span></div>`;
}
export const golfSection = `<section id="putting" class="putting-strip" aria-label="One-hole putting green">
  <canvas id="golf-course" width="2000" height="240" tabindex="0" role="application" aria-label="One straight putting hole" aria-describedby="golf-instructions golf-keyboard">A one-hole putting green. Enable JavaScript to play.</canvas>
  <div class="putting-caption"><span id="golf-instructions">Putt from right to left.</span><div class="putting-totals" aria-label="Mock global putting statistics"><span><b id="golf-attempts">1,248</b> attempts</span><span><b id="golf-made">317</b> made</span><span class="mock-label" title="Simulated global totals. Your shots update this browser only.">Global · demo</span></div></div>
  <span id="golf-status" class="sr-only" role="status" aria-live="polite"></span>
  <span id="golf-keyboard" class="sr-only">Mouse: move the putter into the ball from the right. Touch: pull right from the ball and release. Keyboard: hold Space to draw back and release to putt. Left and right arrows adjust aim. Escape cancels a stroke.</span>
</section>`;
