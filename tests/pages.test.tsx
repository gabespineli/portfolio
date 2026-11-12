import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "../src/Home";
import { Resume } from "../src/Resume";
import { projects } from "../src/projects";

it("preserves project links, golf placement and experience technology cards", () => {
  const html = renderToStaticMarkup(<Home />);
  for (const project of projects) {
    expect(html).not.toContain(`href="/projects/${project.id}/"`);
  }
  expect(html).toContain('href="https://wtpcoffee.com/"');
  expect(html.indexOf('id="putting"')).toBeLessThan(html.indexOf('id="work"'));
  expect(html).toContain('id="golf-keyboard"');
  expect(html).not.toContain("1,248");
  expect(html.match(/tech-stack tech-fan/g)).toHaveLength(3);
  expect(html).toContain('viewBox="0 0 32 32"');
});

it("renders the printable résumé", () => {
  expect(renderToStaticMarkup(<Resume />)).toContain("Print / Save PDF");
});
