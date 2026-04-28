# PRD: Jídelníček

## Problém
Chci mít přehledný týdenní jídelníček se zdravými jídly, která nejsou náročná na přípravu. Potřebuju ho sdílet s partnerkou, aby oba věděli co se kdy vaří.

## Cílový uživatel
Pár (uživatel a partnerka), kteří plánují společné stravování a chtějí mít přehled o týdenním jídelníčku.

## User Stories
- Jako uživatel chci vidět týdenní přehled jídelníčku, abych věděl co se kdy vaří
- Jako uživatel chci přiřadit jídlo na konkrétní den a typ jídla (snídaně/oběd/večeře), abych mohl plánovat dopředu
- Jako uživatel chci procházet seznam dostupných jídel s receptem, abych věděl jak jídlo připravit
- Jako uživatel chci přidat vlastní jídlo s ingrediencemi a postupem, abych rozšířil seznam
- Jako uživatel i partnerka chci vidět stejný jídelníček bez přihlašování, abychom měli sdílený přehled

## MVP Scope

### In scope
- Seznam jídel — 30 předpřipravených zdravých jídel (snídaně, obědy, večeře), možnost přidat vlastní
- Každé jídlo má název, typ (snídaně/oběd/večeře), ingredience a postup přípravy
- Přiřadit jídlo do jídelníčku na konkrétní den a typ jídla
- Zobrazit týdenní přehled jídelníčku
- Sdílené zobrazení bez přihlašování (jeden společný jídelníček)

### Out of scope
- Automatický nákupní seznam z jídelníčku
- Filtrování receptů podle kategorie nebo ingrediencí
- Hodnocení nebo oblíbené recepty
- Přihlašování a osobní účty

## Datový model

### Tabulka: meals
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | integer generated always as identity (PK) | Primární klíč |
| name | text | Název jídla |
| type | text | Typ: snídaně / oběd / večeře |
| ingredients | text | Seznam ingrediencí |
| instructions | text | Postup přípravy |
| user_id | uuid | Reference na auth.users (pro budoucí auth) |
| created_at | timestamptz | Datum vytvoření (default now()) |

### Tabulka: meal_plan
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | integer generated always as identity (PK) | Primární klíč |
| meal_id | integer → meals | Jaké jídlo |
| planned_date | date | Na který den |
| meal_type | text | snídaně / oběd / večeře |
| user_id | uuid | Reference na auth.users (pro budoucí auth) |
| created_at | timestamptz | Datum vytvoření (default now()) |

## SQL pro Supabase

Viz `migrations/001_initial.sql`
