import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "../src/Home";
import { Resume } from "../src/Resume";
import { ProjectPage } from "../src/Project";
import { projects } from "../src/projects";

it("preserves project links, golf placement and experience technology cards", () => {
  const html = renderToStaticMarkup(<Home />);
  for (const project of projects)
    expect(html).toContain(`/projects/${project.id}/`);
  expect(html.indexOf('id="putting"')).toBeLessThan(html.indexOf('id="work"'));
  expect(html).toContain('id="golf-keyboard"');
  expect(html).not.toContain("1,248");
  expect(html.match(/tech-stack tech-fan/g)).toHaveLength(3);
  expect(html).toContain('viewBox="0 0 32 32"');
});

it("renders all case studies and the printable résumé", () => {
  for (const project of projects) {
    const html = renderToStaticMarkup(<ProjectPage project={project} />);
    expect(html).toContain(project.name);
    expect(html).toContain("My contribution");
    expect(html).toContain("next-project");
  }
  expect(renderToStaticMarkup(<Resume />)).toContain("Print / Save PDF");
});
