-- Jídelníček — initial schema
-- Spusť v Supabase SQL Editoru (DEV projekt)
-- Při deployi spusť stejný SQL i v PROD projektu

-- Tabulka jídel (recepty)
CREATE TABLE meals (
  id           integer generated always as identity primary key,
  name         text not null,
  type         text not null check (type in ('snídaně', 'oběd', 'večeře')),
  ingredients  text not null,
  instructions text not null,
  user_id      uuid references auth.users(id),
  created_at   timestamptz default now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meals_allow_all" ON meals FOR ALL USING (true) WITH CHECK (true);

-- Tabulka jídelníčku (plán na konkrétní dny)
CREATE TABLE meal_plan (
  id           integer generated always as identity primary key,
  meal_id      integer not null references meals(id) on delete cascade,
  planned_date date not null,
  meal_type    text not null check (meal_type in ('snídaně', 'oběd', 'večeře')),
  user_id      uuid references auth.users(id),
  created_at   timestamptz default now()
);

ALTER TABLE meal_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_plan_allow_all" ON meal_plan FOR ALL USING (true) WITH CHECK (true);

-- Seed data — 30 předpřipravených zdravých jídel
INSERT INTO meals (name, type, ingredients, instructions) VALUES
-- Snídaně (10)
('Ovesná kaše s ovocem', 'snídaně', '80g ovesných vloček, 300ml mléka, 1 banán, hrst borůvek, 1 lžíce medu', 'Vařte vločky v mléce 5 minut za stálého míchání. Přidejte med, nakrájený banán a borůvky.'),
('Řecký jogurt s granolou', 'snídaně', '200g řeckého jogurtu, 4 lžíce granoly, hrst malin, 1 lžíce medu', 'Dejte jogurt do misky, posypte granolou, přidejte maliny a pokapejte medem.'),
('Avokádový toast', 'snídaně', '2 krajíce celozrnného chleba, 1 avokádo, 2 vajíčka, sůl, pepř, citronová šťáva', 'Opečte chleba. Rozmačkejte avokádo s citronem, solí a pepřem. Natřete na toast, přidejte volské oko.'),
('Míchaná vajíčka se zeleninou', 'snídaně', '3 vejce, 1 paprika, hrst špenátu, 1 rajče, sůl, pepř, olivový olej', 'Orestujte zeleninu na oleji. Přidejte rozšlehaná vejce a míchejte do ztuhnutí.'),
('Smoothie bowl', 'snídaně', '1 banán, hrst jahod, 100ml mandlového mléka, granola, kokos, chia semínka', 'Rozmixujte ovoce s mlékem do husté konzistence. Nalijte do misky, ozdobte granolou, kokosem a chia.'),
('Celozrnné lívance', 'snídaně', '150g celozrnné mouky, 2 vejce, 200ml mléka, 1 lžíce medu, šťáva z půl citronu, prášek do pečiva', 'Smíchejte všechny ingredience. Pečte lívance na suché nepřilnavé pánvi z obou stran.'),
('Vajíčka v rajčatové omáčce', 'snídaně', '4 vejce, 400g drcených rajčat, 1 cibule, 1 stroužek česneku, kmín, paprika, sůl', 'Orestujte cibuli a česnek, přidejte rajčata a koření. Vyklepněte vejce do omáčky a vařte přikryté 8 minut.'),
('Tvarohové palačinky', 'snídaně', '250g tvarohu, 2 vejce, 4 lžíce ovesných vloček, banán, skořice', 'Smíchejte tvaroh, vejce, vločky a rozmačkaný banán. Pečte placičky na pánvi 3 minuty z každé strany.'),
('Chia pudink', 'snídaně', '4 lžíce chia semínek, 250ml kokosového mléka, 1 lžíce medu, mango, máta', 'Smíchejte chia s kokosovým mlékem a medem. Nechte přes noc v lednici. Ráno přidejte nakrájené mango.'),
('Celozrnný toast s vejcem a špenátem', 'snídaně', '2 krajíce celozrnného chleba, 2 vejce, hrst špenátu, 1 stroužek česneku, olivový olej', 'Orestujte špenát s česnekem. Opečte chleba, přidejte špenát a vejce uvařená naměkko.'),

-- Obědy (10)
('Kuřecí salát s quinoou', 'oběd', '150g kuřecích prsou, 100g quinoy, okurka, rajče, rukola, citronová zálivka', 'Uvařte quinou. Grilujte kuře a nakrájejte. Smíchejte s quinoou a zeleninou, polijte zálivkou.'),
('Čočková polévka', 'oběd', '200g červené čočky, 1 mrkev, 2 stonky celeru, 1 cibule, kmín, kurkuma, kokosové mléko', 'Orestujte cibuli a koření. Přidejte zeleninu a čočku, zalijte vývarem. Vařte 20 minut, rozmixujte.'),
('Buddha bowl s tofu', 'oběd', '150g tofu, 100g hnědé rýže, brokolice, mrkev, edamame, tahini zálivka, sezam', 'Uvařte rýži. Opečte tofu. Blanšírujte zeleninu. Sestavte bowl, polijte tahini zálivkou.'),
('Lososový salát', 'oběd', '150g lososa, mix salátů, cherry rajčata, okurka, avokádo, citrónová zálivka', 'Grilujte lososa 4 minuty z každé strany. Sestavte salát, přidejte nakrájený losos a zálivku.'),
('Celozrnné wrappy s kuřetem', 'oběd', '2 celozrnné tortilly, 150g kuřecích prsou, hummus, mix salátů, rajče, okurka', 'Grilujte kuře a nakrájejte na plátky. Natřete tortilly hummusem, přidejte kuře a zeleninu, zarolujte.'),
('Zeleninová polévka minestrone', 'oběd', 'cuketa, mrkev, celer, rajčata, fazole, celozrnné těstoviny, bazalka, parmazán', 'Orestujte zeleninu, zalijte vývarem, vařte 15 minut. Přidejte fazole a těstoviny, vařte dalších 10 minut.'),
('Řecký salát s kuřetem', 'oběd', '150g kuřecích prsou, feta sýr, okurka, rajčata, olivy, červená cibule, oregano, olivový olej', 'Grilujte kuře. Nakrájejte zeleninu, přidejte olivy a fetu. Okoření oreganem a polijte olejem.'),
('Krůtí burger v salátovém listu', 'oběd', '200g krůtího mletého masa, 1 vejce, cibule, česnek, salátový list, rajče, avokádo', 'Smíchejte maso s vejcem, cibulí a česnekem. Tvarujte burgery a grilujte. Podávejte v salátovém listu.'),
('Pohankové rizoto se zeleninou', 'oběd', '150g pohanky, cuketa, hrášek, špenát, cibule, vývar, parmazán', 'Orestujte cibuli, přidejte pohanku a postupně přilévejte vývar. Přimíchejte zeleninu a parmazán.'),
('Tuňákový salát', 'oběd', '1 konzerva tuňáka, mix salátů, cherry rajčata, kukuřice, vejce uvařené natvrdo, olivový olej', 'Smíchejte nakrájené salátové listy s rajčaty a kukuřicí. Přidejte tuňáka a nakrájené vejce. Polijte olejem.'),

-- Večeře (10)
('Pečený losos se zeleninou', 'večeře', '200g lososa, brokolice, mrkev, cuketa, olivový olej, citron, česnek, byliny', 'Dejte lososa a zeleninu na plech, polijte olejem, ochuťte. Pečte na 200°C 20 minut.'),
('Kuřecí stir-fry', 'večeře', '200g kuřecích prsou, paprika, brokolice, mrkev, sójová omáčka, zázvor, česnek, hnědá rýže', 'Orestujte kuře, odložte. Orestujte zeleninu, přidejte kuře, sóju, zázvor a česnek. Podávejte s rýží.'),
('Čočka na kyselo', 'večeře', '250g zelené čočky, 1 cibule, 2 stroužky česneku, ocet, cukr, sůl, majoránka, vejce natvrdo', 'Uvařte čočku. Orestujte cibuli, přidejte k čočce, ochuťte octem, cukrem a majoránkou. Podávejte s vejcem.'),
('Pečené kuře s batáty', 'večeře', '2 kuřecí stehna, 2 batáty, rozmarýn, česnek, olivový olej, paprika, sůl', 'Marinujte kuře v koření a oleji. Nakrájejte batáty. Pečte vše na 180°C 40 minut.'),
('Zeleninové kari s cizrnou', 'večeře', '400g cizrny, kokosové mléko, rajčata, špenát, cibule, česnek, zázvor, curry, basmati rýže', 'Orestujte cibuli, česnek a zázvor. Přidejte koření, rajčata a kokosové mléko. Přidejte cizrnu a špenát. Podávejte s rýží.'),
('Celozrnné těstoviny s pestem', 'večeře', '200g celozrnných těstovin, 3 lžíce pesta, cherry rajčata, parmazán, piniové oříšky', 'Uvařte těstoviny. Smíchejte s pestem, přidejte půlená rajčata. Posypte parmazánem a oříšky.'),
('Treska s bramborovou kaší', 'večeře', '200g tresky, 3 brambory, mléko, máslo, špenát, citron, sůl, pepř', 'Uvařte a rozmačkejte brambory s mlékem a máslem. Orestujte špenát. Pečte tresku na 180°C 15 minut. Podávejte s kaší a špenátem.'),
('Krůtí karbanátky s cuketou', 'večeře', '300g krůtího mletého masa, 1 cuketa, 1 vejce, česnek, petrželka, sůl, pepř', 'Nastrouhejte cuketu a vymačkejte přebytečnou vodu. Smíchejte s masem a vejcem. Pečte karbanátky na 180°C 20 minut.'),
('Fazolové chilli', 'večeře', '2 druhy fazolí (cca 600g), rajčata, cibule, paprika, jalapeño, chilli, kmín, koriandr', 'Orestujte cibuli a papriku. Přidejte rajčata, fazole a koření. Vařte 30 minut. Podávejte s celozrnným chlebem.'),
('Grilovaná zelenina s cottage', 'večeře', 'cuketa, lilek, paprika, červená cibule, cottage sýr, bazalka, olivový olej, balzamikový ocet', 'Nakrájejte zeleninu a grilujte na grilu nebo v troubě. Podávejte s cottage sýrem, posypte bazalkou a polijte balzamikem.');
