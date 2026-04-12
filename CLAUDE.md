# Vibe Coding Workshop — Hack Your Way 2026

Toto je projektový adresář pro workshop "Vibe Coding: od nápadu k deploynuté appce".

## Stack
- Next.js 14+ (App Router) + TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS
- Deploy na Vercel

## Pravidla pro tohle repo
- Používej české komentáře a UI texty
- ID sloupce vždy jako `integer generated always as identity`, nikdy UUID
- Supabase client přes `@supabase/ssr`
- Drž kód jednoduchý — žádné over-engineering, tohle je MVP/prototyp
- Když nevíš, zeptej se uživatele místo hádání

## Dostupné příkazy
Tento projekt má připravené custom commands pro Claude Code:
- `/project:check` — Ověří, že máš vše nainstalované a připravené
- `/project:prd` — PRD agent: provede tě tvorbou produktového zadání krok po kroku
- `/project:scaffold` — Scaffold agent: z PRD vygeneruje celou appku
- `/project:deploy` — Deploy agent: pomůže s nastavením GitHubu a Vercelu
- `/project:feature` — Feature agent: pomůže přidat novou feature do existující appky
