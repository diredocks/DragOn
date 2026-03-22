// Usage: locale-diff.ts [locale-file]
// Defaults to comparing all non-en locales against en.json

import { readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../src/locales");

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flattenKeys(v as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function diffLocale(
  enKeys: string[],
  targetKeys: string[],
  targetFile: string,
): void {
  const missing = enKeys.filter((k) => !targetKeys.includes(k));
  const extra = targetKeys.filter((k) => !enKeys.includes(k));

  console.log(`\n=== ${targetFile} ===`);
  if (missing.length === 0 && extra.length === 0) {
    console.log("  ✓ In sync with en.json");
    return;
  }
  if (missing.length > 0) {
    console.log(`  Missing keys (${missing.length}):`);
    missing.forEach((k) => {
      console.log(`    - ${k}`);
    });
  }
  if (extra.length > 0) {
    console.log(`  Extra keys not in en.json (${extra.length}):`);
    extra.forEach((k) => {
      console.log(`    + ${k}`);
    });
  }
}

const enJson = JSON.parse(readFileSync(join(localesDir, "en.json"), "utf-8"));
const enKeys = flattenKeys(enJson);

const targetArg = process.argv[2];
const files = targetArg
  ? [targetArg]
  : readdirSync(localesDir).filter(
      (f) => f.endsWith(".json") && f !== "en.json",
    );

for (const file of files) {
  try {
    const target = JSON.parse(readFileSync(join(localesDir, file), "utf-8"));
    diffLocale(enKeys, flattenKeys(target), file);
  } catch (e) {
    console.error(`  Error reading ${file}: ${(e as Error).message}`);
  }
}
