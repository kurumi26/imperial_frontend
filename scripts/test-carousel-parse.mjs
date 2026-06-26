import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  sanitizeCmsHtml,
  extractEmbeddedStyles,
  extractEmbeddedScripts,
  parseCmsTestimonialsHtml,
} from "../lib/parseCmsTestimonials.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transcript = fs.readFileSync(
  path.join(
    process.env.USERPROFILE,
    ".cursor/projects/c-Users-saber-Downloads-imperial-imperialpvc-frontend/agent-transcripts/70ed47c2-b8bb-475d-a864-4e9979c91f97/70ed47c2-b8bb-475d-a864-4e9979c91f97.jsonl"
  ),
  "utf8"
);

const line = transcript.split("\n")[100];
const json = JSON.parse(line);
const raw = json.message.content[0].text;
const htmlStart = raw.indexOf('<div id="ifo6"');
const html = raw.slice(htmlStart);

const sanitized = sanitizeCmsHtml(html);
const { htmlWithoutStyles } = extractEmbeddedStyles(sanized);
const { htmlWithoutScripts } = extractEmbeddedScripts(htmlWithoutStyles);
const parsed = parseCmsTestimonialsHtml(htmlWithoutScripts);

const section = parsed.sectionHtml;
console.log("section length:", section.length);
console.log("has tsTrack:", section.includes('id="tsTrack"'));
console.log("has tsPrev:", section.includes('id="tsPrev"'));
console.log("ts-slot count:", (section.match(/class="ts-slot"/g) || []).length);
