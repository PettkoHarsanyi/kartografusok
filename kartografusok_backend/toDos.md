Az elkészítend? webes verzióban a játékosok online csatlakozhatnak meghívás alapján várószobákhoz, amiket egy kinevezett vezet? fog tudni irányítani.
A várószobában üzeneteket küldözgethetnek egymásnak a játékosok. 
A vezet? dobhat ki játékosokat, elnémíthatja ?ket, és indíthatja el a játékot.
Amennyiben a megfelel? mennyiség? játékos csatlakozott a szobához a játék elkezd?dik.
Itt továbbra is üzenet küldés formájában tarthatják a kapcsolatot a résztvev?k.
Minden körben egy alakzatot ad a rendszer, amit minden játékosnak el kell helyezni saját tábláján az általa készített rajzának mintájával kidíszítve.
Minden körben a játékosok meghatározott szabályok alapján pontokat kapnak, ezért számít, hogy az alakzatokat hogyan helyezik el a táblájukon.
Játék közben a játékosok adott esetben jelenthetik egy játékos nem odaill? viselkedését, trágár írásmódját a chaten.
A játék addig tart, míg a játékban négy évszak le nem telik.
A játék végén kialakult pontszámok egy általános ranglistában kerülnek mentésre, amiben a naptári hét „legjobb kartográfusainak” dics? nevét és pontszámát tekintheti meg minden játékos.
Minden héten az elért pontszámuk alapján kerülhetnek fentebbi divíziókba a regisztrált felhasználók.
Ennek a szerepe csak esztékiai szerepet tölt be, ugyanis a játék közben személyüket jelz? profilképük körül az adott divíziójuk jelenik meg.
Ahhoz, hogy a pontszámokat felhasználókhoz rendeljük, természetesen lehet?ség van regisztrációra, és bejelentkezésre.
Vendégként is részt tudunk venni a játékban, ilyenkor a játék végén felajánlja a rendszer, hogy regisztráljunk, vagy jelentkezzünk be, különben az elért pontszámunk elveszik.
A megvalósításhoz frontenden oldalon Reactjs keretrendszert fogok használni. 
A különböz? játékállapotokat React Redux-szal segítségével fogom implementálni.
A játékban szerepl? grafikát - kártyákat, játékteret - saját magam fogom elkészíteni, illetve lehet?ség lesz kés?bb is hozzáadni ilyeneket (kés?bb err?l szó lesz).
Játék közben az online kapcsolat a többi játékossal socket kommunikáción keresztül fog m?ködni. 
A backendet és a hozzá tartozó háttérlogikát NestJS keretrendszer segítségével fogom implementálni, REST API-n keresztül.
Az adatok perzisztens tárolásáért az SQLite adatbázis kezel? felel. 
Az adatbázis legfontosabb eleme a játékosokat és azok adatait eltároló tábla lesz.
Itt tárolódik a nevük, e-mail címük, a hashelt jelszavuk, az összes pontszámuk, a heti pontszámuk, illetve szerepkörük.
Ezek alapján a szerepkör táblában az lesz tárolva.
Ezen kívül lesz egy heti eredményeket tartalmazó tábla, hogy melyik héten ki volt az els? 10 legeredményesebb játékos.
A divíziók tárolására is lesz egy tábla. 
Továbbá egy el?zményeket tartalmazó táblában elérhet? lesz a játékosok utolsó néhány mérk?zése, az azokban elért eredményük. 
Lesz egy admin felület is, ahova a játékkészít?k, hozzájárulók jelentkezhetnek majd be. 
Itt ?k változtathatják a játék során életbe lép? táblák kinézetét, a kártyákat, amiket a rendszer kihúz. 
A többszörös figyelmeztetéseket kapott játékosokat és azok üzenetváltásait az adminok felülvizsgálhatják, és a jogosnak talált jelentéseket elfogadhatják, ezzel végleg
megvonhatják egy játékostól a játék örömét.
Az adminok itt tudnak kinevezni másokat adminnak vagy hozzájárulónak. 
A fejlesztésemet Visual Studio Code-ban fogom végezni, adatbázis tallózónak DB Browser for SQLite programot fogok haszálni.
A fejlesztés folyamatos nyomonkövetését egy online verziókezel? segítségével fogom végezni egy privát repositoryban.