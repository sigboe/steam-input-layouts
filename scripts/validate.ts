/**
 * Validates every <folder>/catalogue.json with the parser WoWDeck itself uses,
 * so a catalogue that passes here is one the app reads in full.
 *
 * Usage: bun scripts/validate.ts <path to a WoWDeck checkout>
 *
 * Fails when a catalogue is not readable, uses a schema the pinned WoWDeck
 * does not read, or has an entry the app would drop.
 */
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const wowdeck = process.argv[2];
if (!wowdeck) {
  console.error("usage: bun scripts/validate.ts <wowdeck checkout>");
  process.exit(2);
}
const parserPath = resolve(wowdeck, "backend/src/wow/controllerLayouts/ControllerLayoutCatalogue.ts");
const { parseCatalogue } = (await import(parserPath)) as {
  parseCatalogue: (text: string) => { state: string; layouts?: unknown[]; schemaVersion?: number };
};

const root = resolve(import.meta.dir, "..");
const catalogues = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("."))
  .map((d) => join(d.name, "catalogue.json"))
  .filter((p) => existsSync(join(root, p)));

if (catalogues.length === 0) {
  console.error("no <folder>/catalogue.json found");
  process.exit(1);
}

let failed = false;
for (const path of catalogues) {
  const text = readFileSync(join(root, path), "utf8");
  const result = parseCatalogue(text);
  if (result.state !== "ready") {
    console.error(`${path}: WoWDeck reads it as "${result.state}"`);
    failed = true;
    continue;
  }
  const listed = (JSON.parse(text) as { layouts: unknown[] }).layouts.length;
  if ((result.layouts ?? []).length !== listed) {
    console.error(`${path}: WoWDeck keeps ${result.layouts!.length} of ${listed} layouts; see the log above for why`);
    failed = true;
  } else {
    console.log(`${path}: ok, ${listed} layout(s)`);
  }
}
process.exit(failed ? 1 : 0);
