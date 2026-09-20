import fs from "node:fs/promises";
import path from "node:path";
import { createDb } from "@paperclipai/db";
import { companySkillService } from "../PaperClip/server/src/services/company-skills.ts";

async function walk(dir: string, base = ""): Promise<Record<string, string>> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: Record<string, string> = {};
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(out, await walk(full, rel));
    } else if (entry.isFile()) {
      out[rel] = await fs.readFile(full, "utf8");
    }
  }
  return out;
}

async function main() {
  const dbUrl = process.env.DATABASE_URL || "postgres://paperclip:paperclip@localhost:5432/paperclip";
  const db = createDb(dbUrl);
  const svc = companySkillService(db);
  const companyId = "bc798241-61a1-494d-9b5a-ee458b85653d";
  
  const skillsDir = path.resolve("PaperClip-Companies/promptcore-labs/skills");
  console.log("Scanning skills from:", skillsDir);
  const files = await walk(skillsDir, "skills");
  console.log("Total files found:", Object.keys(files).length);

  const results = await svc.importPackageFiles(companyId, files, { onConflict: "replace" });
  console.log("Imported skills total:", results.length);
  const created = results.filter((r) => r.action === "created").length;
  const updated = results.filter((r) => r.action === "updated").length;
  console.log(`Created: ${created}, Updated: ${updated}`);
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
