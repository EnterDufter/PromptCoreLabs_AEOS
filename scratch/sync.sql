BEGIN;

INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ab-test-analysis',
    'ab-test-analysis',
    'ab-test-analysis',
    'Analyze A/B test results with statistical significance, sample size validation, confidence intervals, and ship/extend/stop recommendations',
    'local_path',
    '/app/companies/promptcore-labs/skills/ab-test-analysis',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ab-test-analysis
description: "Analyze A/B test results with statistical significance, sample size validation, confidence intervals, and ship/extend/stop recommendations"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-data-analytics/skills/ab-test-analysis/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Analyze A/B test results with statistical significance, sample size validation, confidence intervals, and ship/extend/stop recommendations. Use when evaluating experiment results, checking if a test reached significance, interpreting split test data, or deciding whether to ship a variant.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'accessibility',
    'accessibility',
    'accessibility',
    'Audit and improve web accessibility following WCAG 2.1 guidelines, screen reader support, and keyboard navigation.',
    'local_path',
    '/app/companies/promptcore-labs/skills/accessibility',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: accessibility
description: "Audit and improve web accessibility following WCAG 2.1 guidelines, screen reader support, and keyboard navigation."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(quality)/accessibility
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Audit and improve web accessibility following WCAG 2.1 guidelines. Screen reader support, keyboard navigation, and a11y compliance.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'agent-skills-cli',
    'agent-skills-cli',
    'agent-skills-cli',
    'Manage agent skills lifecycle, CLI commands, skill discovery, security scanning, and lockfile synchronization.',
    'local_path',
    '/app/companies/promptcore-labs/skills/agent-skills-cli',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: agent-skills-cli
description: "Manage agent skills lifecycle, CLI commands, skill discovery, security scanning, and lockfile synchronization."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(tooling)/agent-skills-cli
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Manage agent skills lifecycle, CLI commands, skill discovery, security scanning, and lockfile synchronization via @tech-leads-club/agent-skills CLI.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ai-cold-outreach',
    'ai-cold-outreach',
    'ai-cold-outreach',
    'Build AI-powered cold outreach system, write cold emails, improve deliverability, and scale personalized outreach sequences.',
    'local_path',
    '/app/companies/promptcore-labs/skills/ai-cold-outreach',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ai-cold-outreach
description: "Build AI-powered cold outreach system, write cold emails, improve deliverability, and scale personalized outreach sequences."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(gtm)/ai-cold-outreach
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Build AI-powered cold outreach system, write cold email sequences, improve deliverability, and scale personalized outreach from signal detection through conversion.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ai-pricing',
    'ai-pricing',
    'ai-pricing',
    'Pricing AI products, charge metrics selection, pricing tiers design, and AI margin optimization.',
    'local_path',
    '/app/companies/promptcore-labs/skills/ai-pricing',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ai-pricing
description: "Pricing AI products, charge metrics selection, pricing tiers design, and AI margin optimization."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(gtm)/ai-pricing
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Price AI products, choose charge metrics, design pricing tiers, and optimize AI margins and consumption pricing for AI-native products.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ai-sdr',
    'ai-sdr',
    'ai-sdr',
    'Deploy AI sales development reps, automate sales qualification, build signal-to-action routing, and design AI agent architecture for sales development.',
    'local_path',
    '/app/companies/promptcore-labs/skills/ai-sdr',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ai-sdr
description: "Deploy AI sales development reps, automate sales qualification, build signal-to-action routing, and design AI agent architecture for sales development."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(gtm)/ai-sdr
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Deploy AI sales development reps, automate sales qualification, build signal-to-action routing, and design AI agent architecture for sales development. Covers AI SDR deployment, qualification automation, and signal routing.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ai-seo',
    'ai-seo',
    'ai-seo',
    'Programmatic SEO with AI, competitor alternative pages, AI Overviews optimization, and scale content production.',
    'local_path',
    '/app/companies/promptcore-labs/skills/ai-seo',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ai-seo
description: "Programmatic SEO with AI, competitor alternative pages, AI Overviews optimization, and scale content production."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(gtm)/ai-seo
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Build programmatic SEO with AI, create competitor alternative pages, optimize for AI Overviews, and scale content production from keyword strategy through page generation.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ai-ugc-ads',
    'ai-ugc-ads',
    'ai-ugc-ads',
    'Create UGC ad campaigns, recruit UGC creators, generate AI UGC content, and scale user-generated content marketing.',
    'local_path',
    '/app/companies/promptcore-labs/skills/ai-ugc-ads',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ai-ugc-ads
description: "Create UGC ad campaigns, recruit UGC creators, generate AI UGC content, and scale user-generated content marketing."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(gtm)/ai-ugc-ads
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Create UGC ad campaigns, recruit UGC creators, generate AI UGC content, and scale user-generated content ads from creator briefs to testing and scaling.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'analyze-feature-requests',
    'analyze-feature-requests',
    'analyze-feature-requests',
    'Analyze and prioritize a list of feature requests by theme, strategic alignment, impact, effort, and risk',
    'local_path',
    '/app/companies/promptcore-labs/skills/analyze-feature-requests',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: analyze-feature-requests
description: "Analyze and prioritize a list of feature requests by theme, strategic alignment, impact, effort, and risk"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/analyze-feature-requests/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Analyze and prioritize a list of feature requests by theme, strategic alignment, impact, effort, and risk. Use when reviewing customer feature requests, triaging a backlog, or making prioritization decisions.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ansoff-matrix',
    'ansoff-matrix',
    'ansoff-matrix',
    'Generate an Ansoff Matrix analysis mapping growth strategies across market penetration, market development, product development, and diversification',
    'local_path',
    '/app/companies/promptcore-labs/skills/ansoff-matrix',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ansoff-matrix
description: "Generate an Ansoff Matrix analysis mapping growth strategies across market penetration, market development, product development, and diversification"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/ansoff-matrix/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate an Ansoff Matrix analysis mapping growth strategies across market penetration, market development, product development, and diversification. Use when considering growth options, planning market expansion, or evaluating strategic growth paths.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'aws-advisor',
    'aws-advisor',
    'aws-advisor',
    'Expert AWS Cloud Advisor for architecture design, security review, and implementation guidance backed by AWS MCP tools.',
    'local_path',
    '/app/companies/promptcore-labs/skills/aws-advisor',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: aws-advisor
description: "Expert AWS Cloud Advisor for architecture design, security review, and implementation guidance backed by AWS MCP tools."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(cloud)/aws-advisor
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Expert AWS Cloud Advisor for architecture design, security review, and implementation guidance. Leverages AWS MCP tools for accurate, documentation-backed answers.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'beachhead-segment',
    'beachhead-segment',
    'beachhead-segment',
    'Identify the first beachhead market segment for a product launch. Evaluates segments against burning pain, willingness to pay, winnable market share, and referral potential',
    'local_path',
    '/app/companies/promptcore-labs/skills/beachhead-segment',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: beachhead-segment
description: "Identify the first beachhead market segment for a product launch. Evaluates segments against burning pain, willingness to pay, winnable market share, and referral potential"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-go-to-market/skills/beachhead-segment/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify the first beachhead market segment for a product launch. Evaluates segments against burning pain, willingness to pay, winnable market share, and referral potential. Use when choosing a first market, targeting an initial customer segment, or planning market entry strategy.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'best-practices',
    'best-practices',
    'best-practices',
    'Apply modern web development best practices for security, compatibility, code quality, and security audits.',
    'local_path',
    '/app/companies/promptcore-labs/skills/best-practices',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: best-practices
description: "Apply modern web development best practices for security, compatibility, code quality, and security audits."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(quality)/best-practices
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Apply modern web development best practices for security, compatibility, and code quality. Security audits, code modernization, and vulnerability checking.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'brainstorm-experiments-existing',
    'brainstorm-experiments-existing',
    'brainstorm-experiments-existing',
    'Design experiments to test assumptions for an existing product — prototypes, A/B tests, spikes, and other low-effort validation methods',
    'local_path',
    '/app/companies/promptcore-labs/skills/brainstorm-experiments-existing',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: brainstorm-experiments-existing
description: "Design experiments to test assumptions for an existing product — prototypes, A/B tests, spikes, and other low-effort validation methods"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/brainstorm-experiments-existing/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Design experiments to test assumptions for an existing product — prototypes, A/B tests, spikes, and other low-effort validation methods. Use when validating assumptions, testing feature ideas cheaply, or planning product experiments.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'brainstorm-experiments-new',
    'brainstorm-experiments-new',
    'brainstorm-experiments-new',
    'Design lean startup experiments (pretotypes) for a new product. Creates XYZ hypotheses and suggests low-effort validation methods like landing pages, explainer videos, and pre-orders',
    'local_path',
    '/app/companies/promptcore-labs/skills/brainstorm-experiments-new',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: brainstorm-experiments-new
description: "Design lean startup experiments (pretotypes) for a new product. Creates XYZ hypotheses and suggests low-effort validation methods like landing pages, explainer videos, and pre-orders"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/brainstorm-experiments-new/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Design lean startup experiments (pretotypes) for a new product. Creates XYZ hypotheses and suggests low-effort validation methods like landing pages, explainer videos, and pre-orders. Use when validating a new product idea, creating pretotypes, or testing market demand.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'brainstorm-ideas-existing',
    'brainstorm-ideas-existing',
    'brainstorm-ideas-existing',
    'Brainstorm product ideas for an existing product using multi-perspective ideation from PM, Designer, and Engineer viewpoints',
    'local_path',
    '/app/companies/promptcore-labs/skills/brainstorm-ideas-existing',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: brainstorm-ideas-existing
description: "Brainstorm product ideas for an existing product using multi-perspective ideation from PM, Designer, and Engineer viewpoints"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/brainstorm-ideas-existing/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm product ideas for an existing product using multi-perspective ideation from PM, Designer, and Engineer viewpoints. Use when generating new feature ideas, brainstorming solutions for an identified opportunity, or ideating with a product trio.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'brainstorm-ideas-new',
    'brainstorm-ideas-new',
    'brainstorm-ideas-new',
    'Brainstorm feature ideas for a new product in initial discovery from PM, Designer, and Engineer perspectives',
    'local_path',
    '/app/companies/promptcore-labs/skills/brainstorm-ideas-new',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: brainstorm-ideas-new
description: "Brainstorm feature ideas for a new product in initial discovery from PM, Designer, and Engineer perspectives"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/brainstorm-ideas-new/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm feature ideas for a new product in initial discovery from PM, Designer, and Engineer perspectives. Use when starting product discovery for a new product, exploring features for a startup idea, or doing initial ideation.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'brainstorm-okrs',
    'brainstorm-okrs',
    'brainstorm-okrs',
    'Brainstorm team-level OKRs aligned with company objectives — qualitative objectives with measurable key results',
    'local_path',
    '/app/companies/promptcore-labs/skills/brainstorm-okrs',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: brainstorm-okrs
description: "Brainstorm team-level OKRs aligned with company objectives — qualitative objectives with measurable key results"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/brainstorm-okrs/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm team-level OKRs aligned with company objectives — qualitative objectives with measurable key results. Use when setting quarterly OKRs, aligning team goals with company strategy, drafting objectives, or learning how to write effective OKRs.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'business-model',
    'business-model',
    'business-model',
    'Generate a Business Model Canvas with all 9 building blocks',
    'local_path',
    '/app/companies/promptcore-labs/skills/business-model',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: business-model
description: "Generate a Business Model Canvas with all 9 building blocks"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/business-model/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate a Business Model Canvas with all 9 building blocks. Use when creating a business model, documenting how a business creates value, or analyzing an existing business model.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'cohort-analysis',
    'cohort-analysis',
    'cohort-analysis',
    'Perform cohort analysis on user engagement data — retention curves, feature adoption trends, and segment-level insights',
    'local_path',
    '/app/companies/promptcore-labs/skills/cohort-analysis',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: cohort-analysis
description: "Perform cohort analysis on user engagement data — retention curves, feature adoption trends, and segment-level insights"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-data-analytics/skills/cohort-analysis/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Perform cohort analysis on user engagement data — retention curves, feature adoption trends, and segment-level insights. Use when analyzing user retention by cohort, studying feature adoption over time, investigating churn patterns, or identifying engagement trends.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'competitive-battlecard',
    'competitive-battlecard',
    'competitive-battlecard',
    'Create sales-ready competitive battlecards comparing your product against a specific competitor — positioning, feature comparison, objection handling, and win/loss patterns',
    'local_path',
    '/app/companies/promptcore-labs/skills/competitive-battlecard',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: competitive-battlecard
description: "Create sales-ready competitive battlecards comparing your product against a specific competitor — positioning, feature comparison, objection handling, and win/loss patterns"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-go-to-market/skills/competitive-battlecard/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create sales-ready competitive battlecards comparing your product against a specific competitor — positioning, feature comparison, objection handling, and win/loss patterns. Use when preparing sales teams, creating competitive materials, or responding to ''why not competitor X?''
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'competitor-analysis',
    'competitor-analysis',
    'competitor-analysis',
    'Analyze competitors with strengths, weaknesses, and differentiation opportunities. Identifies direct competitors and maps the competitive landscape',
    'local_path',
    '/app/companies/promptcore-labs/skills/competitor-analysis',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: competitor-analysis
description: "Analyze competitors with strengths, weaknesses, and differentiation opportunities. Identifies direct competitors and maps the competitive landscape"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/competitor-analysis/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Analyze competitors with strengths, weaknesses, and differentiation opportunities. Identifies direct competitors and maps the competitive landscape. Use when doing competitive research, preparing a competitive brief, or finding differentiation opportunities.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'create-adr',
    'create-adr',
    'create-adr',
    'Create Architecture Decision Records (ADRs) to document significant architectural choices and their rationale.',
    'local_path',
    '/app/companies/promptcore-labs/skills/create-adr',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: create-adr
description: "Create Architecture Decision Records (ADRs) to document significant architectural choices and their rationale."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(architecture)/create-adr
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Creates Architecture Decision Records (ADRs) to document significant architectural choices and their rationale for future team members and stakeholders.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'create-prd',
    'create-prd',
    'create-prd',
    'Create a Product Requirements Document using a comprehensive 8-section template covering problem, objectives, segments, value propositions, solution, and release planning',
    'local_path',
    '/app/companies/promptcore-labs/skills/create-prd',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: create-prd
description: "Create a Product Requirements Document using a comprehensive 8-section template covering problem, objectives, segments, value propositions, solution, and release planning"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/create-prd/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create a Product Requirements Document using a comprehensive 8-section template covering problem, objectives, segments, value propositions, solution, and release planning. Use when writing a PRD, documenting product requirements, preparing a feature spec, or reviewing an existing PRD.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'create-rfc',
    'create-rfc',
    'create-rfc',
    'Create Request for Comments (RFC) documents for technical proposals, system design changes, and architectural alignment.',
    'local_path',
    '/app/companies/promptcore-labs/skills/create-rfc',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: create-rfc
description: "Create Request for Comments (RFC) documents for technical proposals, system design changes, and architectural alignment."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(architecture)/create-rfc
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Creates Request for Comments (RFC) documents for technical proposals, system design changes, and architectural alignment across teams.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'customer-journey-map',
    'customer-journey-map',
    'customer-journey-map',
    'Create an end-to-end customer journey map with stages, touchpoints, emotions, pain points, and opportunities',
    'local_path',
    '/app/companies/promptcore-labs/skills/customer-journey-map',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: customer-journey-map
description: "Create an end-to-end customer journey map with stages, touchpoints, emotions, pain points, and opportunities"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/customer-journey-map/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create an end-to-end customer journey map with stages, touchpoints, emotions, pain points, and opportunities. Use when mapping the customer experience, identifying friction points, improving onboarding, or visualizing the user journey.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'draft-nda',
    'draft-nda',
    'draft-nda',
    'Draft a detailed Non-Disclosure Agreement between two parties covering information types, jurisdiction, and clauses needing legal review',
    'local_path',
    '/app/companies/promptcore-labs/skills/draft-nda',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: draft-nda
description: "Draft a detailed Non-Disclosure Agreement between two parties covering information types, jurisdiction, and clauses needing legal review"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-toolkit/skills/draft-nda/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Draft a detailed Non-Disclosure Agreement between two parties covering information types, jurisdiction, and clauses needing legal review. Use when creating confidentiality agreements or preparing an NDA for a partnership.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'dummy-dataset',
    'dummy-dataset',
    'dummy-dataset',
    'Generate realistic dummy datasets for testing with customizable columns, constraints, and output formats (CSV, JSON, SQL, Python script)',
    'local_path',
    '/app/companies/promptcore-labs/skills/dummy-dataset',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: dummy-dataset
description: "Generate realistic dummy datasets for testing with customizable columns, constraints, and output formats (CSV, JSON, SQL, Python script)"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/dummy-dataset/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate realistic dummy datasets for testing with customizable columns, constraints, and output formats (CSV, JSON, SQL, Python script). Use when creating test data, building mock datasets, or generating sample data for development and demos.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'grammar-check',
    'grammar-check',
    'grammar-check',
    'Identify grammar, logical, and flow errors in text and suggest targeted fixes without rewriting the entire text',
    'local_path',
    '/app/companies/promptcore-labs/skills/grammar-check',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: grammar-check
description: "Identify grammar, logical, and flow errors in text and suggest targeted fixes without rewriting the entire text"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-toolkit/skills/grammar-check/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify grammar, logical, and flow errors in text and suggest targeted fixes without rewriting the entire text. Use when proofreading content, checking writing quality, or reviewing a draft.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'growth-loops',
    'growth-loops',
    'growth-loops',
    'Identify growth loops (flywheels) for sustainable traction. Evaluates 5 loop types: Viral, Usage, Collaboration, User-Generated, and Referral',
    'local_path',
    '/app/companies/promptcore-labs/skills/growth-loops',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: growth-loops
description: "Identify growth loops (flywheels) for sustainable traction. Evaluates 5 loop types: Viral, Usage, Collaboration, User-Generated, and Referral"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-go-to-market/skills/growth-loops/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify growth loops (flywheels) for sustainable traction. Evaluates 5 loop types: Viral, Usage, Collaboration, User-Generated, and Referral. Use when designing growth mechanisms, building product-led traction, or understanding how growth loops work.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'gtm-motions',
    'gtm-motions',
    'gtm-motions',
    'Identify the best GTM motions and tools across 7 motion types: Inbound, Outbound, Paid Digital, Community, Partners, ABM, and PLG',
    'local_path',
    '/app/companies/promptcore-labs/skills/gtm-motions',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: gtm-motions
description: "Identify the best GTM motions and tools across 7 motion types: Inbound, Outbound, Paid Digital, Community, Partners, ABM, and PLG"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-go-to-market/skills/gtm-motions/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify the best GTM motions and tools across 7 motion types: Inbound, Outbound, Paid Digital, Community, Partners, ABM, and PLG. Use when selecting marketing channels, choosing between inbound and outbound strategy, or planning cross-channel campaigns.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'gtm-strategy',
    'gtm-strategy',
    'gtm-strategy',
    'Create a go-to-market strategy covering marketing channels, messaging, success metrics, and launch timeline',
    'local_path',
    '/app/companies/promptcore-labs/skills/gtm-strategy',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: gtm-strategy
description: "Create a go-to-market strategy covering marketing channels, messaging, success metrics, and launch timeline"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-go-to-market/skills/gtm-strategy/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create a go-to-market strategy covering marketing channels, messaging, success metrics, and launch timeline. Use when planning a product launch, creating a GTM plan from scratch, or defining a launch strategy for a new market.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ideal-customer-profile',
    'ideal-customer-profile',
    'ideal-customer-profile',
    'Identify the Ideal Customer Profile (ICP) from research data with demographics, behaviors, JTBD, and needs',
    'local_path',
    '/app/companies/promptcore-labs/skills/ideal-customer-profile',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ideal-customer-profile
description: "Identify the Ideal Customer Profile (ICP) from research data with demographics, behaviors, JTBD, and needs"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-go-to-market/skills/ideal-customer-profile/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify the Ideal Customer Profile (ICP) from research data with demographics, behaviors, JTBD, and needs. Use when defining your ICP, analyzing PMF survey data, or understanding who your best customers are.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'identify-assumptions-existing',
    'identify-assumptions-existing',
    'identify-assumptions-existing',
    'Identify risky assumptions for a feature idea in an existing product across Value, Usability, Viability, and Feasibility. Uses multi-perspective devil''s advocate thinking',
    'local_path',
    '/app/companies/promptcore-labs/skills/identify-assumptions-existing',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: identify-assumptions-existing
description: "Identify risky assumptions for a feature idea in an existing product across Value, Usability, Viability, and Feasibility. Uses multi-perspective devil''s advocate thinking"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/identify-assumptions-existing/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify risky assumptions for a feature idea in an existing product across Value, Usability, Viability, and Feasibility. Uses multi-perspective devil''s advocate thinking. Use when stress-testing a feature idea, doing risk assessment, or preparing for assumption mapping.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'identify-assumptions-new',
    'identify-assumptions-new',
    'identify-assumptions-new',
    'Identify risky assumptions for a new product idea across 8 risk categories including Go-to-Market, Strategy, and Team',
    'local_path',
    '/app/companies/promptcore-labs/skills/identify-assumptions-new',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: identify-assumptions-new
description: "Identify risky assumptions for a new product idea across 8 risk categories including Go-to-Market, Strategy, and Team"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/identify-assumptions-new/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify risky assumptions for a new product idea across 8 risk categories including Go-to-Market, Strategy, and Team. Use when evaluating startup risks, assessing a new product concept, or mapping assumptions for a new venture.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'interview-script',
    'interview-script',
    'interview-script',
    'Create a structured customer interview script with JTBD probing questions, warm-up, core exploration, and wrap-up sections. Follows The Mom Test principles — no leading questions, no pitching, focu...',
    'local_path',
    '/app/companies/promptcore-labs/skills/interview-script',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: interview-script
description: "Create a structured customer interview script with JTBD probing questions, warm-up, core exploration, and wrap-up sections. Follows The Mom Test principles — no leading questions, no pitching, focu..."
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/interview-script/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create a structured customer interview script with JTBD probing questions, warm-up, core exploration, and wrap-up sections. Follows The Mom Test principles — no leading questions, no pitching, focus on past behavior. Use when preparing for user interviews, creating interview guides, or planning discovery research.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'job-stories',
    'job-stories',
    'job-stories',
    'Create job stories using the ''When [situation], I want to [motivation], so I can [outcome]'' format with detailed acceptance criteria',
    'local_path',
    '/app/companies/promptcore-labs/skills/job-stories',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: job-stories
description: "Create job stories using the ''When [situation], I want to [motivation], so I can [outcome]'' format with detailed acceptance criteria"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/job-stories/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create job stories using the ''When [situation], I want to [motivation], so I can [outcome]'' format with detailed acceptance criteria. Use when writing job stories, creating JTBD-style backlog items, or expressing user situations and motivations.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'lean-canvas',
    'lean-canvas',
    'lean-canvas',
    'Generate a Lean Canvas with problem, solution, metrics, cost structure, UVP, unfair advantage, channels, segments, and revenue',
    'local_path',
    '/app/companies/promptcore-labs/skills/lean-canvas',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: lean-canvas
description: "Generate a Lean Canvas with problem, solution, metrics, cost structure, UVP, unfair advantage, channels, segments, and revenue"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/lean-canvas/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate a Lean Canvas with problem, solution, metrics, cost structure, UVP, unfair advantage, channels, segments, and revenue. Use when exploring a lean startup canvas, testing a business hypothesis, or modeling a new venture.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'market-segments',
    'market-segments',
    'market-segments',
    'Identify 3-5 potential customer segments with demographics, JTBD, and product fit analysis',
    'local_path',
    '/app/companies/promptcore-labs/skills/market-segments',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: market-segments
description: "Identify 3-5 potential customer segments with demographics, JTBD, and product fit analysis"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/market-segments/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Identify 3-5 potential customer segments with demographics, JTBD, and product fit analysis. Use when exploring market segments, identifying target audiences, evaluating new markets, or learning how to segment a market.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'market-sizing',
    'market-sizing',
    'market-sizing',
    'Estimate market size using TAM, SAM, and SOM with top-down and bottom-up approaches',
    'local_path',
    '/app/companies/promptcore-labs/skills/market-sizing',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: market-sizing
description: "Estimate market size using TAM, SAM, and SOM with top-down and bottom-up approaches"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/market-sizing/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Estimate market size using TAM, SAM, and SOM with top-down and bottom-up approaches. Use when sizing a market opportunity, estimating addressable market, preparing for investor pitches, or evaluating market entry.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'marketing-ideas',
    'marketing-ideas',
    'marketing-ideas',
    'Generate 5 creative, cost-effective marketing ideas with channels, messaging, and engagement rationale',
    'local_path',
    '/app/companies/promptcore-labs/skills/marketing-ideas',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: marketing-ideas
description: "Generate 5 creative, cost-effective marketing ideas with channels, messaging, and engagement rationale"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-marketing-growth/skills/marketing-ideas/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate 5 creative, cost-effective marketing ideas with channels, messaging, and engagement rationale. Use when brainstorming marketing campaigns, planning product promotion, or looking for creative marketing tactics.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'metrics-dashboard',
    'metrics-dashboard',
    'metrics-dashboard',
    'Define and design a product metrics dashboard with key metrics, data sources, visualization types, and alert thresholds',
    'local_path',
    '/app/companies/promptcore-labs/skills/metrics-dashboard',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: metrics-dashboard
description: "Define and design a product metrics dashboard with key metrics, data sources, visualization types, and alert thresholds"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/metrics-dashboard/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Define and design a product metrics dashboard with key metrics, data sources, visualization types, and alert thresholds. Use when creating a metrics dashboard, defining KPIs, setting up product analytics, or building a data monitoring plan.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'monetization-strategy',
    'monetization-strategy',
    'monetization-strategy',
    'Brainstorm 3-5 monetization strategies with audience fit, risks, and validation experiments',
    'local_path',
    '/app/companies/promptcore-labs/skills/monetization-strategy',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: monetization-strategy
description: "Brainstorm 3-5 monetization strategies with audience fit, risks, and validation experiments"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/monetization-strategy/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm 3-5 monetization strategies with audience fit, risks, and validation experiments. Use when exploring revenue models, evaluating pricing strategies, or deciding how to monetize a product.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'north-star-metric',
    'north-star-metric',
    'north-star-metric',
    'Define a North Star Metric and 3-5 supporting input metrics that form a metrics constellation. Classify the business game (Attention, Transaction, Productivity) and validate against 7 criteria for ...',
    'local_path',
    '/app/companies/promptcore-labs/skills/north-star-metric',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: north-star-metric
description: "Define a North Star Metric and 3-5 supporting input metrics that form a metrics constellation. Classify the business game (Attention, Transaction, Productivity) and validate against 7 criteria for ..."
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-marketing-growth/skills/north-star-metric/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Define a North Star Metric and 3-5 supporting input metrics that form a metrics constellation. Classify the business game (Attention, Transaction, Productivity) and validate against 7 criteria for an effective North Star. Use when choosing a North Star Metric, setting up a metrics framework, learning about the North Star Framework, or deciding what to measure.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'opportunity-solution-tree',
    'opportunity-solution-tree',
    'opportunity-solution-tree',
    'Build an Opportunity Solution Tree (OST) to structure product discovery — map a desired outcome to opportunities, solutions, and experiments. Based on Teresa Torres'' Continuous Discovery Habits',
    'local_path',
    '/app/companies/promptcore-labs/skills/opportunity-solution-tree',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: opportunity-solution-tree
description: "Build an Opportunity Solution Tree (OST) to structure product discovery — map a desired outcome to opportunities, solutions, and experiments. Based on Teresa Torres'' Continuous Discovery Habits"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/opportunity-solution-tree/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Build an Opportunity Solution Tree (OST) to structure product discovery — map a desired outcome to opportunities, solutions, and experiments. Based on Teresa Torres'' Continuous Discovery Habits. Use when structuring discovery work, mapping opportunities to solutions, or deciding what to build next.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'outcome-roadmap',
    'outcome-roadmap',
    'outcome-roadmap',
    'Transform an output-focused roadmap into an outcome-focused one that communicates strategic intent. Rewrites initiatives as outcome statements reflecting user and business impacts',
    'local_path',
    '/app/companies/promptcore-labs/skills/outcome-roadmap',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: outcome-roadmap
description: "Transform an output-focused roadmap into an outcome-focused one that communicates strategic intent. Rewrites initiatives as outcome statements reflecting user and business impacts"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/outcome-roadmap/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Transform an output-focused roadmap into an outcome-focused one that communicates strategic intent. Rewrites initiatives as outcome statements reflecting user and business impacts. Use when shifting to outcome roadmaps, making a roadmap more strategic, or rewriting feature lists as outcomes.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'perf-astro',
    'perf-astro',
    'perf-astro',
    'Optimize Astro.js applications for web performance, zero-JS hydration, lighthouse scores, and fast page loads.',
    'local_path',
    '/app/companies/promptcore-labs/skills/perf-astro',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: perf-astro
description: "Optimize Astro.js applications for web performance, zero-JS hydration, lighthouse scores, and fast page loads."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(performance)/perf-astro
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Optimize Astro.js applications for web performance, zero-JS hydration, lighthouse scores, and fast page loads.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'pestle-analysis',
    'pestle-analysis',
    'pestle-analysis',
    'Perform a PESTLE analysis covering Political, Economic, Social, Technological, Legal, and Environmental factors',
    'local_path',
    '/app/companies/promptcore-labs/skills/pestle-analysis',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: pestle-analysis
description: "Perform a PESTLE analysis covering Political, Economic, Social, Technological, Legal, and Environmental factors"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/pestle-analysis/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Perform a PESTLE analysis covering Political, Economic, Social, Technological, Legal, and Environmental factors. Use when assessing the macro environment, doing strategic planning, or evaluating external factors affecting your business.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'porters-five-forces',
    'porters-five-forces',
    'porters-five-forces',
    'Perform Porter''s Five Forces analysis — competitive rivalry, supplier power, buyer power, threat of substitutes, and threat of new entrants',
    'local_path',
    '/app/companies/promptcore-labs/skills/porters-five-forces',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: porters-five-forces
description: "Perform Porter''s Five Forces analysis — competitive rivalry, supplier power, buyer power, threat of substitutes, and threat of new entrants"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/porters-five-forces/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Perform Porter''s Five Forces analysis — competitive rivalry, supplier power, buyer power, threat of substitutes, and threat of new entrants. Use when analyzing industry dynamics, assessing competitive forces, or evaluating market attractiveness.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'positioning-ideas',
    'positioning-ideas',
    'positioning-ideas',
    'Brainstorm product positioning ideas differentiated from competitors. Identifies top competitors and generates positioning statements with rationale',
    'local_path',
    '/app/companies/promptcore-labs/skills/positioning-ideas',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: positioning-ideas
description: "Brainstorm product positioning ideas differentiated from competitors. Identifies top competitors and generates positioning statements with rationale"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-marketing-growth/skills/positioning-ideas/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm product positioning ideas differentiated from competitors. Identifies top competitors and generates positioning statements with rationale. Use when developing product positioning, differentiating from competitors, or crafting brand positioning strategy.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'pre-mortem',
    'pre-mortem',
    'pre-mortem',
    'Run a pre-mortem risk analysis on a PRD or launch plan. Categorizes risks as Tigers (real problems), Paper Tigers (overblown concerns), and Elephants (unspoken worries), then classifies as launch-b...',
    'local_path',
    '/app/companies/promptcore-labs/skills/pre-mortem',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: pre-mortem
description: "Run a pre-mortem risk analysis on a PRD or launch plan. Categorizes risks as Tigers (real problems), Paper Tigers (overblown concerns), and Elephants (unspoken worries), then classifies as launch-b..."
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/pre-mortem/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Run a pre-mortem risk analysis on a PRD or launch plan. Categorizes risks as Tigers (real problems), Paper Tigers (overblown concerns), and Elephants (unspoken worries), then classifies as launch-blocking, fast-follow, or track. Use when preparing for launch, stress-testing a product plan, or identifying what could go wrong.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'pricing-strategy',
    'pricing-strategy',
    'pricing-strategy',
    'Analyze and design pricing strategies including pricing models, competitive pricing analysis, willingness-to-pay estimation, and price elasticity',
    'local_path',
    '/app/companies/promptcore-labs/skills/pricing-strategy',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: pricing-strategy
description: "Analyze and design pricing strategies including pricing models, competitive pricing analysis, willingness-to-pay estimation, and price elasticity"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/pricing-strategy/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Analyze and design pricing strategies including pricing models, competitive pricing analysis, willingness-to-pay estimation, and price elasticity. Use when setting prices, evaluating pricing models, preparing for a pricing change, or comparing freemium vs paid approaches.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'prioritization-frameworks',
    'prioritization-frameworks',
    'prioritization-frameworks',
    'Reference guide to 9 prioritization frameworks with formulas, when-to-use guidance, and templates — RICE, ICE, Kano, MoSCoW, Opportunity Score, and more',
    'local_path',
    '/app/companies/promptcore-labs/skills/prioritization-frameworks',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: prioritization-frameworks
description: "Reference guide to 9 prioritization frameworks with formulas, when-to-use guidance, and templates — RICE, ICE, Kano, MoSCoW, Opportunity Score, and more"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/prioritization-frameworks/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Reference guide to 9 prioritization frameworks with formulas, when-to-use guidance, and templates — RICE, ICE, Kano, MoSCoW, Opportunity Score, and more. Use when selecting a prioritization method, comparing frameworks like RICE vs ICE, or learning how different prioritization approaches work.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'prioritize-assumptions',
    'prioritize-assumptions',
    'prioritize-assumptions',
    'Prioritize assumptions using an Impact × Risk matrix and suggest experiments for each',
    'local_path',
    '/app/companies/promptcore-labs/skills/prioritize-assumptions',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: prioritize-assumptions
description: "Prioritize assumptions using an Impact × Risk matrix and suggest experiments for each"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/prioritize-assumptions/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Prioritize assumptions using an Impact × Risk matrix and suggest experiments for each. Use when triaging a list of assumptions, deciding what to test first, or applying the assumption prioritization canvas.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'prioritize-features',
    'prioritize-features',
    'prioritize-features',
    'Prioritize a backlog of feature ideas based on impact, effort, risk, and strategic alignment with top 5 recommendations',
    'local_path',
    '/app/companies/promptcore-labs/skills/prioritize-features',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: prioritize-features
description: "Prioritize a backlog of feature ideas based on impact, effort, risk, and strategic alignment with top 5 recommendations"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/prioritize-features/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Prioritize a backlog of feature ideas based on impact, effort, risk, and strategic alignment with top 5 recommendations. Use when prioritizing a feature backlog, making scope decisions, or ranking product ideas.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'privacy-policy',
    'privacy-policy',
    'privacy-policy',
    'Draft a detailed privacy policy covering data types, jurisdiction, GDPR and compliance considerations, and clauses needing legal review',
    'local_path',
    '/app/companies/promptcore-labs/skills/privacy-policy',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: privacy-policy
description: "Draft a detailed privacy policy covering data types, jurisdiction, GDPR and compliance considerations, and clauses needing legal review"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-toolkit/skills/privacy-policy/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Draft a detailed privacy policy covering data types, jurisdiction, GDPR and compliance considerations, and clauses needing legal review. Use when creating a privacy policy, updating data protection documentation, or preparing for compliance.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'product-name',
    'product-name',
    'product-name',
    'Brainstorm 5 unique, memorable product names with rationale aligned to brand values and target audience',
    'local_path',
    '/app/companies/promptcore-labs/skills/product-name',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: product-name
description: "Brainstorm 5 unique, memorable product names with rationale aligned to brand values and target audience"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-marketing-growth/skills/product-name/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm 5 unique, memorable product names with rationale aligned to brand values and target audience. Use when naming a new product, rebranding, or exploring product name ideas.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'product-strategy',
    'product-strategy',
    'product-strategy',
    'Create a comprehensive product strategy using the 9-section Product Strategy Canvas — vision, segments, costs, value propositions, trade-offs, metrics, growth, capabilities, and defensibility',
    'local_path',
    '/app/companies/promptcore-labs/skills/product-strategy',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: product-strategy
description: "Create a comprehensive product strategy using the 9-section Product Strategy Canvas — vision, segments, costs, value propositions, trade-offs, metrics, growth, capabilities, and defensibility"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/product-strategy/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create a comprehensive product strategy using the 9-section Product Strategy Canvas — vision, segments, costs, value propositions, trade-offs, metrics, growth, capabilities, and defensibility. Use when building a product strategy, creating a strategic plan, or defining product direction.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'product-vision',
    'product-vision',
    'product-vision',
    'Brainstorm an inspiring, achievable, and emotional product vision that motivates teams and aligns stakeholders',
    'local_path',
    '/app/companies/promptcore-labs/skills/product-vision',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: product-vision
description: "Brainstorm an inspiring, achievable, and emotional product vision that motivates teams and aligns stakeholders"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/product-vision/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Brainstorm an inspiring, achievable, and emotional product vision that motivates teams and aligns stakeholders. Use when defining or refining a product vision, creating a vision statement, or aligning the team around a shared direction.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'rapid-prototyping',
    'rapid-prototyping',
    'rapid-prototyping',
    'Rapidly prototype MVPs, PoCs, and software solutions using Spec-Driven Development (SDD) and lean technical spikes.',
    'local_path',
    '/app/companies/promptcore-labs/skills/rapid-prototyping',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: rapid-prototyping
description: "Rapidly prototype MVPs, PoCs, and software solutions using Spec-Driven Development (SDD) and lean technical spikes."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(prototyping)/rapid-prototyping
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Rapidly prototype MVPs, PoCs, and software solutions using Spec-Driven Development (SDD), modular code scaffolding, and lean technical spikes.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'release-notes',
    'release-notes',
    'release-notes',
    'Generate user-facing release notes from tickets, PRDs, or changelogs. Creates clear, engaging summaries organized by category (new features, improvements, fixes)',
    'local_path',
    '/app/companies/promptcore-labs/skills/release-notes',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: release-notes
description: "Generate user-facing release notes from tickets, PRDs, or changelogs. Creates clear, engaging summaries organized by category (new features, improvements, fixes)"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/release-notes/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate user-facing release notes from tickets, PRDs, or changelogs. Creates clear, engaging summaries organized by category (new features, improvements, fixes). Use when writing release notes, creating changelogs, announcing product updates, or summarizing what shipped.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'retro',
    'retro',
    'retro',
    'Facilitate a structured sprint retrospective — what went well, what didn''t, and prioritized action items with owners and deadlines',
    'local_path',
    '/app/companies/promptcore-labs/skills/retro',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: retro
description: "Facilitate a structured sprint retrospective — what went well, what didn''t, and prioritized action items with owners and deadlines"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/retro/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Facilitate a structured sprint retrospective — what went well, what didn''t, and prioritized action items with owners and deadlines. Use when running a retrospective, reflecting on a sprint, creating action items from team feedback, or learning how to run effective retros.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'review-resume',
    'review-resume',
    'review-resume',
    'Comprehensive PM resume review and tailoring against 10 best practices including XYZ+S formula, keyword optimization, job-specific tailoring, and structure',
    'local_path',
    '/app/companies/promptcore-labs/skills/review-resume',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: review-resume
description: "Comprehensive PM resume review and tailoring against 10 best practices including XYZ+S formula, keyword optimization, job-specific tailoring, and structure"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-toolkit/skills/review-resume/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Comprehensive PM resume review and tailoring against 10 best practices including XYZ+S formula, keyword optimization, job-specific tailoring, and structure. Use when reviewing a PM resume, preparing for job applications, or improving resume impact.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'sentiment-analysis',
    'sentiment-analysis',
    'sentiment-analysis',
    'Analyze user feedback data to identify segments with sentiment scores, JTBD, and product satisfaction insights',
    'local_path',
    '/app/companies/promptcore-labs/skills/sentiment-analysis',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: sentiment-analysis
description: "Analyze user feedback data to identify segments with sentiment scores, JTBD, and product satisfaction insights"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/sentiment-analysis/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Analyze user feedback data to identify segments with sentiment scores, JTBD, and product satisfaction insights. Use when analyzing user feedback at scale, running sentiment analysis on reviews or surveys, or identifying satisfaction patterns.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'sprint-plan',
    'sprint-plan',
    'sprint-plan',
    'Plan a sprint with capacity estimation, story selection, dependency mapping, and risk identification',
    'local_path',
    '/app/companies/promptcore-labs/skills/sprint-plan',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: sprint-plan
description: "Plan a sprint with capacity estimation, story selection, dependency mapping, and risk identification"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/sprint-plan/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Plan a sprint with capacity estimation, story selection, dependency mapping, and risk identification. Use when preparing for sprint planning, estimating team capacity, selecting stories, or balancing sprint scope against velocity.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'sql-queries',
    'sql-queries',
    'sql-queries',
    'Generate SQL queries from natural language descriptions',
    'local_path',
    '/app/companies/promptcore-labs/skills/sql-queries',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: sql-queries
description: "Generate SQL queries from natural language descriptions"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-data-analytics/skills/sql-queries/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate SQL queries from natural language descriptions. Supports BigQuery, PostgreSQL, MySQL, and other dialects. Reads database schemas from uploaded diagrams or documentation. Use when writing SQL, building data reports, exploring databases, or translating business questions into queries.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'stakeholder-map',
    'stakeholder-map',
    'stakeholder-map',
    'Build a stakeholder map using a power/interest grid, identify communication strategies per quadrant, and generate a communication plan',
    'local_path',
    '/app/companies/promptcore-labs/skills/stakeholder-map',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: stakeholder-map
description: "Build a stakeholder map using a power/interest grid, identify communication strategies per quadrant, and generate a communication plan"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/stakeholder-map/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Build a stakeholder map using a power/interest grid, identify communication strategies per quadrant, and generate a communication plan. Use when managing stakeholders, preparing for a launch, aligning cross-functional teams, or planning stakeholder engagement.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'startup-canvas',
    'startup-canvas',
    'startup-canvas',
    'Generate a Startup Canvas combining Product Strategy (9 sections) and Business Model (costs + revenue) for a new product. An alternative to BMC and Lean Canvas that separates strategy from business...',
    'local_path',
    '/app/companies/promptcore-labs/skills/startup-canvas',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: startup-canvas
description: "Generate a Startup Canvas combining Product Strategy (9 sections) and Business Model (costs + revenue) for a new product. An alternative to BMC and Lean Canvas that separates strategy from business..."
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/startup-canvas/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate a Startup Canvas combining Product Strategy (9 sections) and Business Model (costs + revenue) for a new product. An alternative to BMC and Lean Canvas that separates strategy from business model. Use when launching a new product or evaluating a startup concept.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'summarize-interview',
    'summarize-interview',
    'summarize-interview',
    'Summarize a customer interview transcript into a structured template with JTBD, satisfaction signals, and action items',
    'local_path',
    '/app/companies/promptcore-labs/skills/summarize-interview',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: summarize-interview
description: "Summarize a customer interview transcript into a structured template with JTBD, satisfaction signals, and action items"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-discovery/skills/summarize-interview/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Summarize a customer interview transcript into a structured template with JTBD, satisfaction signals, and action items. Use when processing interview recordings or transcripts, synthesizing discovery interviews, or creating interview summaries.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'summarize-meeting',
    'summarize-meeting',
    'summarize-meeting',
    'Summarize a meeting transcript into structured notes with date, participants, topic, key decisions, summary points, and action items',
    'local_path',
    '/app/companies/promptcore-labs/skills/summarize-meeting',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: summarize-meeting
description: "Summarize a meeting transcript into structured notes with date, participants, topic, key decisions, summary points, and action items"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/summarize-meeting/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Summarize a meeting transcript into structured notes with date, participants, topic, key decisions, summary points, and action items. Use when processing meeting recordings, creating meeting notes, writing meeting minutes, or recapping discussions.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'swot-analysis',
    'swot-analysis',
    'swot-analysis',
    'Perform a detailed SWOT analysis — strengths, weaknesses, opportunities, and threats with actionable recommendations',
    'local_path',
    '/app/companies/promptcore-labs/skills/swot-analysis',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: swot-analysis
description: "Perform a detailed SWOT analysis — strengths, weaknesses, opportunities, and threats with actionable recommendations"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/swot-analysis/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Perform a detailed SWOT analysis — strengths, weaknesses, opportunities, and threats with actionable recommendations. Use when doing strategic assessment, competitive analysis, or evaluating a product or business position.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'test-scenarios',
    'test-scenarios',
    'test-scenarios',
    'Create comprehensive test scenarios from user stories with test objectives, starting conditions, user roles, step-by-step actions, and expected outcomes',
    'local_path',
    '/app/companies/promptcore-labs/skills/test-scenarios',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: test-scenarios
description: "Create comprehensive test scenarios from user stories with test objectives, starting conditions, user roles, step-by-step actions, and expected outcomes"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/test-scenarios/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create comprehensive test scenarios from user stories with test objectives, starting conditions, user roles, step-by-step actions, and expected outcomes. Use when writing QA test cases, creating test plans, defining acceptance tests, or preparing for feature validation.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'tlc-spec-driven',
    'tlc-spec-driven',
    'tlc-spec-driven',
    'Feature planning and implementation with 4 adaptive phases — Specify, Design, Tasks, Execute. Creates atomic tasks with verification criteria, atomic git commits, and requirement traceability.',
    'local_path',
    '/app/companies/promptcore-labs/skills/tlc-spec-driven',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: tlc-spec-driven
description: "Feature planning and implementation with 4 adaptive phases — Specify, Design, Tasks, Execute. Creates atomic tasks with verification criteria, atomic git commits, and requirement traceability."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(development)/tlc-spec-driven
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Feature planning and implementation with 4 adaptive phases — Specify, Design, Tasks, Execute. Auto-sizes depth by complexity. Creates atomic tasks with verification criteria, atomic git commits, and requirement traceability. Features an independent Verifier (author != verifier, evidence-or-zero), persistent decision log (STATE.md), and test-coverage-matrix-driven tests, plus a self-improving lessons layer that turns verification failures into reusable project-local guidance.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'ui-mockups-antigravity',
    'ui-mockups-antigravity',
    'ui-mockups-antigravity',
    'Design and build high-fidelity UI/UX mockups leveraging Antigravity IDE capabilities (StitchMCP, generate_image, browser subagent, glassmorphism, and dynamic aesthetics).',
    'local_path',
    '/app/companies/promptcore-labs/skills/ui-mockups-antigravity',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: ui-mockups-antigravity
description: "Design and build high-fidelity UI/UX mockups leveraging Antigravity IDE capabilities (StitchMCP, generate_image, browser subagent, glassmorphism, and dynamic aesthetics)."
metadata:
  sources:
    - kind: github-dir
      repo: tech-leads-club/agent-skills
      path: packages/skills-catalog/skills/(ui-ux)/ui-mockups-antigravity
      attribution: Tech Leads Club
      license: MIT
      usage: referenced
---

Design and build high-fidelity UI/UX mockups leveraging Antigravity IDE capabilities including StitchMCP, image generation, browser subagent automation, glassmorphism, responsive design, and dynamic design aesthetics.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'user-personas',
    'user-personas',
    'user-personas',
    'Create refined user personas from research data — 3 personas with JTBD, pains, gains, and unexpected insights',
    'local_path',
    '/app/companies/promptcore-labs/skills/user-personas',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: user-personas
description: "Create refined user personas from research data — 3 personas with JTBD, pains, gains, and unexpected insights"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/user-personas/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create refined user personas from research data — 3 personas with JTBD, pains, gains, and unexpected insights. Use when building personas from survey data, creating user profiles from research, or segmenting users for product decisions.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'user-segmentation',
    'user-segmentation',
    'user-segmentation',
    'Segment users from feedback data based on behavior, JTBD, and needs. Identifies at least 3 distinct user segments',
    'local_path',
    '/app/companies/promptcore-labs/skills/user-segmentation',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: user-segmentation
description: "Segment users from feedback data based on behavior, JTBD, and needs. Identifies at least 3 distinct user segments"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-market-research/skills/user-segmentation/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Segment users from feedback data based on behavior, JTBD, and needs. Identifies at least 3 distinct user segments. Use when segmenting a user base, analyzing diverse user feedback, or building a segmentation model.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'user-stories',
    'user-stories',
    'user-stories',
    'Create user stories following the 3 C''s (Card, Conversation, Confirmation) and INVEST criteria with descriptions, design links, and acceptance criteria',
    'local_path',
    '/app/companies/promptcore-labs/skills/user-stories',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: user-stories
description: "Create user stories following the 3 C''s (Card, Conversation, Confirmation) and INVEST criteria with descriptions, design links, and acceptance criteria"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/user-stories/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create user stories following the 3 C''s (Card, Conversation, Confirmation) and INVEST criteria with descriptions, design links, and acceptance criteria. Use when writing user stories, breaking down features into backlog items, or defining acceptance criteria.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'value-prop-statements',
    'value-prop-statements',
    'value-prop-statements',
    'Generate value proposition statements for marketing, sales, and onboarding from existing value propositions',
    'local_path',
    '/app/companies/promptcore-labs/skills/value-prop-statements',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: value-prop-statements
description: "Generate value proposition statements for marketing, sales, and onboarding from existing value propositions"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-marketing-growth/skills/value-prop-statements/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Generate value proposition statements for marketing, sales, and onboarding from existing value propositions. Use when writing marketing copy, creating sales messaging, or crafting onboarding messages.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'value-proposition',
    'value-proposition',
    'value-proposition',
    'Design a detailed value proposition using a 6-part JTBD template — Who, Why, What before, How, What after, Alternatives',
    'local_path',
    '/app/companies/promptcore-labs/skills/value-proposition',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: value-proposition
description: "Design a detailed value proposition using a 6-part JTBD template — Who, Why, What before, How, What after, Alternatives"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-product-strategy/skills/value-proposition/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Design a detailed value proposition using a 6-part JTBD template — Who, Why, What before, How, What after, Alternatives. Use when creating a value proposition, analyzing customer value delivery, or articulating why customers should choose your product.
',
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


INSERT INTO company_skills (
    id, company_id, key, slug, name, description, source_type, source_locator,
    trust_level, compatibility, file_inventory, metadata, markdown, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'bc798241-61a1-494d-9b5a-ee458b85653d',
    'wwas',
    'wwas',
    'wwas',
    'Create product backlog items in Why-What-Acceptance format — independent, valuable, testable items with strategic context',
    'local_path',
    '/app/companies/promptcore-labs/skills/wwas',
    'markdown_only',
    'compatible',
    '[{"path": "SKILL.md", "kind": "skill"}]'::jsonb,
    '{"sourceKind": "project_scan"}'::jsonb,
    '---
name: wwas
description: "Create product backlog items in Why-What-Acceptance format — independent, valuable, testable items with strategic context"
metadata:
  sources:
    - kind: github-file
      repo: phuryn/pm-skills
      path: pm-execution/skills/wwas/SKILL.md
      commit: 36ccefdc6c2e00d7c0c12cb0a52bf93e8ec50da4
      attribution: Pawel Huryn
      license: MIT
      usage: referenced
---

Create product backlog items in Why-What-Acceptance format — independent, valuable, testable items with strategic context. Use when writing structured backlog items, breaking features into work items, or using the WWA format.
',
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


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["brainstorm-okrs", "north-star-metric", "product-vision", "outcome-roadmap", "summarize-meeting", "ai-pricing", "create-rfc", "tlc-spec-driven"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'CEO';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["pricing-strategy", "monetization-strategy", "market-sizing", "summarize-interview", "draft-nda", "ai-pricing"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Financial_Advisor';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["sprint-plan", "prioritization-frameworks", "prioritize-features", "release-notes", "summarize-meeting", "retro", "tlc-spec-driven", "best-practices"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'BizOps_Controller';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["marketing-ideas", "positioning-ideas", "product-name", "value-prop-statements", "customer-journey-map", "user-personas", "ai-seo", "ai-ugc-ads"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Neuromarketing_Strategist';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["brainstorm-okrs", "north-star-metric", "product-vision", "outcome-roadmap", "swot-analysis", "lean-canvas", "competitor-analysis", "business-model", "competitive-battlecard", "ai-pricing", "create-rfc"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Strategist_One';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["ab-test-analysis", "metrics-dashboard", "cohort-analysis", "growth-loops", "user-segmentation", "product-vision", "ai-seo", "best-practices"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Data_Insight_Agent';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["pre-mortem", "privacy-policy", "test-scenarios", "aws-advisor", "best-practices"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'CISO_Security_Agent';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["draft-nda", "privacy-policy", "create-adr"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Compliance_Steward';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["review-resume", "interview-script", "summarize-interview", "grammar-check", "agent-skills-cli"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Skills_Manager';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["user-stories", "create-prd", "sprint-plan", "test-scenarios", "prioritize-features", "outcome-roadmap", "tlc-spec-driven", "create-adr", "best-practices", "perf-astro", "rapid-prototyping", "UI-mockups-antigravity"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'Lead_TLC_Engineer';


UPDATE agents 
SET adapter_config = jsonb_set(adapter_config, '{paperclipSkillSync,desiredSkills}', '["ideal-customer-profile", "gtm-strategy", "gtm-motions", "cohort-analysis", "growth-loops", "user-segmentation", "customer-journey-map", "ai-sdr", "ai-cold-outreach"]'::jsonb),
    updated_at = NOW()
WHERE company_id = 'bc798241-61a1-494d-9b5a-ee458b85653d' AND name = 'RevOps_Architect';

COMMIT;