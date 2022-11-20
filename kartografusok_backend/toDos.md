o  Az elkészítendő webes verzióban a játékosok online csatlakozhatnak meghívás alapján várószobákhoz, amiket egy kinevezett vezető fog tudni irányítani.
o  A várószobában üzeneteket küldözgethetnek egymásnak a játékosok. 
o  A vezeto dobhat ki játékosokat, elnémíthatja őket, és indíthatja el a játékot.
o  Amennyiben a megfelelő mennyiségő játékos csatlakozott a szobához a játék elkezd?dik.
o  Itt továbbra is üzenet küldés formájában tarthatják a kapcsolatot a résztvev?k.
o  Minden körben egy alakzatot ad a rendszer, amit minden játékosnak el kell helyezni saját tábláján az általa készített rajzának mintájával kidíszítve.
o  Minden körben a játékosok meghatározott szabályok alapján pontokat kapnak, ezért számít, hogy az alakzatokat hogyan helyezik el a táblájukon.
-  Játék közben a játékosok adott esetben jelenthetik egy játékos nem odaillő viselkedését, trágár írásmódját a chaten.
o  A játék addig tart, míg a játékban négy évszak le nem telik.
o  A játék végén kialakult pontszámok egy általános ranglistában kerülnek mentésre, 
o  amiben a naptári hét „legjobb kartográfusainak” dicső nevét és pontszámát tekintheti meg minden játékos.
o  Minden héten az elért pontszámuk alapján kerülhetnek fentebbi divíziókba a regisztrált felhasználók.
o  Ennek a szerepe csak esztékiai szerepet tölt be, ugyanis a játék közben személyüket jelző profilképük körül az adott divíziójuk jelenik meg.
o  Ahhoz, hogy a pontszámokat felhasználókhoz rendeljük, természetesen lehetőség van regisztrációra, és bejelentkezésre.
o  (ENNEK FRONTENDJE)
o  Vendégként is részt tudunk venni a játékban, ilyenkor a játék végén felajánlja a rendszer, hogy regisztráljunk, vagy jelentkezzünk be, különben az elért pontszámunk elveszik.
o  A megvalósításhoz frontenden oldalon Reactjs keretrendszert fogok használni. 
o  A különböző játékállapotokat React Redux-szal segítségével fogom implementálni.
o  A játékban szereplő grafikát - kártyákat, játékteret - saját magam fogom elkészíteni, illetve lehetőség lesz később is hozzáadni ilyeneket (később erről szó lesz).
o  Játék közben az online kapcsolat a többi játékossal socket kommunikáción keresztül fog m?ködni. 
o  A backendet és a hozzá tartozó háttérlogikát NestJS keretrendszer segítségével fogom implementálni, REST API-n keresztül.
o  Az adatok perzisztens tárolásáért az SQLite adatbázis kezel? felel. 
o  Az adatbázis legfontosabb eleme a játékosokat és azok adatait eltároló tábla lesz.
o  Itt tárolódik a nevük, e-mail címük, a hashelt jelszavuk, az összes pontszámuk, a heti pontszámuk, illetve szerepkörük.
o  Ezen kívül lesz egy heti eredményeket tartalmazó tábla, hogy melyik héten ki volt az els? 10 legeredményesebb játékos.
o  (ENNEK FRONTENDJE)
o  A divíziók tárolására is lesz egy tábla. 
o  Továbbá egy előzményeket tartalmazó táblában elérhet? lesz a játékosok utolsó néhány mérk?zése, az azokban elért eredményük. 
o  Lesz egy admin felület is, ahova a játékkészítők, hozzájárulók jelentkezhetnek majd be. 
o  Itt ők változtathatják a játék során életbe lépő táblák kinézetét, a kártyákat, amiket a rendszer kihúz. 
o  A többszörös figyelmeztetéseket kapott játékosokat és azok üzenetváltásait az adminok felülvizsgálhatják, és a jogosnak talált jelentéseket elfogadhatják, ezzel végleg megvonhatják egy játékostól a játék örömét.
o  (ENNEK FRONTENDJE)
o  Az adminok itt tudnak kinevezni másokat adminnak vagy hozzájárulónak. 
o  A fejlesztésemet Visual Studio Code-ban fogom végezni, adatbázis tallózónak DB Browser for SQLite programot fogok haszálni.
o  A fejlesztés folyamatos nyomonkövetését egy online verziókezel? segítségével fogom végezni egy privát repositoryban.

Hot ToDos:
o Visszaállítani a UserParamot
o CORS policy reactben (PROXY)