// Regenerates src/data/rivals.json from the game client's rival data, so the wiki
// stays in step with the lobby. Run from website/: `pnpm sync:rivals [path-to-rivals.yaml]`.
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";

const source = process.argv[2] ?? "../client/client/pages/lobby/rival/data/rivals.yaml";
const data = parse(readFileSync(source, "utf8").replace(/^﻿/, ""));
writeFileSync("src/data/rivals.json", JSON.stringify(data, null, 2) + "\n");
console.log(`Synced ${data.rivals.length} rivals from ${source}`);
