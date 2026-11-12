import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

it("exposes sharing metadata in initial HTML and ships its correctly sized preview", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const field = (name: string) =>
    html.match(
      new RegExp(`<meta (?:name|property)="${name}" content="([^"]+)"`),
    )?.[1];
  expect(field("og:type")).toBe("website");
  expect(field("og:url")).toBe("https://gabespineli.vercel.app/");
  expect(field("og:title")).toBe("Gab's Portfolio");
  expect(field("twitter:title")).toBe(field("og:title"));
  expect(field("description")).toBe("Explore my work.");
  expect(field("og:description")).toBe(field("description"));
  expect(field("twitter:description")).toBe(field("description"));
  expect(field("twitter:card")).toBe("summary_large_image");
  expect(field("twitter:image")).toBe(field("og:image"));
  const imageUrl = new URL(field("og:image")!);
  expect(imageUrl.protocol).toBe("https:");
  const png = readFileSync(
    new URL(`../public${imageUrl.pathname}`, import.meta.url),
  );
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});
