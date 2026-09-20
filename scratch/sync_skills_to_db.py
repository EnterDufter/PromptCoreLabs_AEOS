import os
import json
import re
import subprocess

SKILLS_DIR = r"c:\PromptCore_Labs\PaperClip-Companies\promptcore-labs\skills"
AGENTS_DIR = r"c:\PromptCore_Labs\PaperClip-Companies\promptcore-labs\agents"
COMPANY_ID = "bc798241-61a1-494d-9b5a-ee458b85653d"

def parse_yaml_frontmatter(content):
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    raw_yaml = parts[1].strip()
    body = parts[2].strip()
    
    name_match = re.search(r"^name:\s*(.+)$", raw_yaml, re.MULTILINE)
    desc_match = re.search(r"^description:\s*[\"']?(.*?)[\"']?$", raw_yaml, re.MULTILINE)
    
    name = name_match.group(1).strip().strip('"').strip("'") if name_match else ""
    desc = desc_match.group(1).strip().strip('"').strip("'") if desc_match else ""
    
    # Simple list parser for skills array in AGENTS.md
    skills = []
    in_skills = False
    for line in raw_yaml.splitlines():
        if line.startswith("skills:"):
            in_skills = True
            continue
        if in_skills:
            if line.startswith("  - ") or line.startswith("- "):
                skills.append(line.split("-", 1)[1].strip().strip('"').strip("'"))
            elif line and not line.startswith(" ") and not line.startswith("#"):
                in_skills = False

    return {"name": name, "description": desc, "skills": skills}, body

def get_inventory(skill_dir):
    inventory = []
    for root, dirs, files in os.walk(skill_dir):
        for f in files:
            rel = os.path.relpath(os.path.join(root, f), skill_dir).replace("\\", "/")
            kind = "skill" if rel.lower() == "skill.md" else ("script" if rel.startswith("scripts/") else "markdown")
            inventory.append({"path": rel, "kind": kind})
    inventory.sort(key=lambda x: x["path"])
    return inventory

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def main():
    sql_lines = ["BEGIN;"]
    
    # 1. Upsert all skills in skills directory
    skill_names = [d for d in os.listdir(SKILLS_DIR) if os.path.isdir(os.path.join(SKILLS_DIR, d))]
    print(f"Found {len(skill_names)} skills in {SKILLS_DIR}")

    for skill_name in skill_names:
        skill_path = os.path.join(SKILLS_DIR, skill_name)
        skill_md = os.path.join(skill_path, "SKILL.md")
        if not os.path.exists(skill_md):
            continue
        
        with open(skill_md, "r", encoding="utf-8") as f:
            content = f.read()
        
        frontmatter, body = parse_yaml_frontmatter(content)
        name = frontmatter.get("name") or skill_name
        desc = frontmatter.get("description") or ""
        inventory = get_inventory(skill_path)
        
        source_locator = f"/app/companies/promptcore-labs/skills/{skill_name}"
        trust_level = "scripts_executables" if any(x["kind"] == "script" for x in inventory) else "markdown_only"
        
        metadata_json = json.dumps({"sourceKind": "project_scan"})
        inventory_json = json.dumps(inventory)
        
        sql = f"""
INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    {escape_sql(COMPANY_ID)},
    {escape_sql(skill_name)},
    {escape_sql(skill_name)},
    {escape_sql(name)},
    {escape_sql(desc)},
    'local_path',
    {escape_sql(source_locator)},
    {escape_sql(trust_level)},
    'compatible',
    {escape_sql(inventory_json)}::jsonb,
    {escape_sql(metadata_json)}::jsonb,
    {escape_sql(content)},
    NOW(),
    NOW()
) ON CONFLICT (company_id, key) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    source_type = EXCLUDED.source_type,
    source_locator = EXCLUDED.source_locator,
    trust_level = EXCLUDED.trust_level,
    file_inventory = EXCLUDED.file_inventory,
    metadata = EXCLUDED.metadata,
    markdown = EXCLUDED.markdown,
    updated_at = NOW();
"""
        sql_lines.append(sql)

    # 2. Update agent desiredSkills from AGENTS.md
    for root, dirs, files in os.walk(AGENTS_DIR):
        for f in files:
            if f == "AGENTS.md":
                agent_md_path = os.path.join(root, f)
                with open(agent_md_path, "r", encoding="utf-8") as fp:
                    agent_content = fp.read()
                frontmatter, _ = parse_yaml_frontmatter(agent_content)
                agent_name = frontmatter.get("name")
                desired_skills = frontmatter.get("skills", [])
                if agent_name and desired_skills:
                    desired_skills_json = json.dumps(desired_skills)
                    sql = f"""
UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{{paperclipSkillSync,desiredSkills}}', {escape_sql(desired_skills_json)}::jsonb),
    updated_at = NOW()
WHERE company_id = {escape_sql(COMPANY_ID)} AND name = {escape_sql(agent_name)};
"""
                    sql_lines.append(sql)

    sql_lines.append("COMMIT;")
    
    script_path = r"c:\PromptCore_Labs\scratch\sync.sql"
    with open(script_path, "w", encoding="utf-8") as out_f:
        out_f.write("\n".join(sql_lines))
    
    print(f"Generated SQL script with {len(sql_lines)} statements at {script_path}")

if __name__ == "__main__":
    main()
