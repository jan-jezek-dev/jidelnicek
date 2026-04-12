# Vibe Coding Workshop Kit

Workshop materiály pro **Hack Your Way 2026** — "Od nápadu k deploynuté appce za 3 hodiny"

## Quick Start

```bash
# 1. Naklonuj tento kit do nového adresáře pro svůj projekt
git clone https://github.com/[TBD]/workshop-kit.git moje-appka
cd moje-appka

# 2. Spusť Claude Code
claude

# 3. Ověř, že máš vše připravené
/project:check

# 4. Začni s PRD agentem
/project:prd
```

## Dostupné příkazy

| Příkaz | Co dělá | Kdy použít |
|--------|---------|------------|
| `/project:check` | Ověří prerekvizity (Node, Git, účty...) | Ještě před workshopem |
| `/project:prd` | Provede tě tvorbou produktového zadání | Na začátku — první krok |
| `/project:scaffold` | Z PRD vygeneruje celou appku | Po dokončení PRD |
| `/project:deploy` | Pomůže s GitHubem a Vercel deployem | Když chceš appku na internet |
| `/project:feature` | Pomůže přidat novou feature | Kdykoliv chceš vylepšit appku |

## Prerekvizity

- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)
- [Claude Code](https://docs.claude.com/en/docs/claude-code) (vyžaduje Claude Pro/Max)
- [Supabase účet](https://supabase.com) (free tier)
- [Vercel účet](https://vercel.com) (free tier)
- [GitHub účet](https://github.com)

## Stack

- **Next.js** — React framework (App Router, TypeScript)
- **Supabase** — PostgreSQL databáze + autentizace
- **Tailwind CSS** — styling
- **Vercel** — hosting a automatický deploy

## Typický flow

```
/project:prd          →  Vytvořím PRD s datovým modelem
                          Spustím SQL v Supabase SQL Editoru
/project:scaffold     →  Vygeneruji celou appku
                          npm run dev → vidím appku lokálně
/project:deploy       →  Push na GitHub + deploy na Vercel
                          Mám živou URL!
/project:feature      →  Přidávám features, iteruji
                          git push → auto-redeploy
```
