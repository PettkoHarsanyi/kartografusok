Az elk�sz�tend? webes verzi�ban a j�t�kosok online csatlakozhatnak megh�v�s alapj�n v�r�szob�khoz, amiket egy kinevezett vezet? fog tudni ir�ny�tani.
A v�r�szob�ban �zeneteket k�ld�zgethetnek egym�snak a j�t�kosok. 
A vezet? dobhat ki j�t�kosokat, eln�m�thatja ?ket, �s ind�thatja el a j�t�kot.
Amennyiben a megfelel? mennyis�g? j�t�kos csatlakozott a szob�hoz a j�t�k elkezd?dik.
Itt tov�bbra is �zenet k�ld�s form�j�ban tarthatj�k a kapcsolatot a r�sztvev?k.
Minden k�rben egy alakzatot ad a rendszer, amit minden j�t�kosnak el kell helyezni saj�t t�bl�j�n az �ltala k�sz�tett rajz�nak mint�j�val kid�sz�tve.
Minden k�rben a j�t�kosok meghat�rozott szab�lyok alapj�n pontokat kapnak, ez�rt sz�m�t, hogy az alakzatokat hogyan helyezik el a t�bl�jukon.
J�t�k k�zben a j�t�kosok adott esetben jelenthetik egy j�t�kos nem odaill? viselked�s�t, tr�g�r �r�sm�dj�t a chaten.
A j�t�k addig tart, m�g a j�t�kban n�gy �vszak le nem telik.
A j�t�k v�g�n kialakult pontsz�mok egy �ltal�nos ranglist�ban ker�lnek ment�sre, amiben a napt�ri h�t �legjobb kartogr�fusainak� dics? nev�t �s pontsz�m�t tekintheti meg minden j�t�kos.
Minden h�ten az el�rt pontsz�muk alapj�n ker�lhetnek fentebbi div�zi�kba a regisztr�lt felhaszn�l�k.
Ennek a szerepe csak eszt�kiai szerepet t�lt be, ugyanis a j�t�k k�zben szem�ly�ket jelz? profilk�p�k k�r�l az adott div�zi�juk jelenik meg.
Ahhoz, hogy a pontsz�mokat felhaszn�l�khoz rendelj�k, term�szetesen lehet?s�g van regisztr�ci�ra, �s bejelentkez�sre.
Vend�gk�nt is r�szt tudunk venni a j�t�kban, ilyenkor a j�t�k v�g�n felaj�nlja a rendszer, hogy regisztr�ljunk, vagy jelentkezz�nk be, k�l�nben az el�rt pontsz�munk elveszik.
A megval�s�t�shoz frontenden oldalon Reactjs keretrendszert fogok haszn�lni. 
A k�l�nb�z? j�t�k�llapotokat React Redux-szal seg�ts�g�vel fogom implement�lni.
A j�t�kban szerepl? grafik�t - k�rty�kat, j�t�kteret - saj�t magam fogom elk�sz�teni, illetve lehet?s�g lesz k�s?bb is hozz�adni ilyeneket (k�s?bb err?l sz� lesz).
J�t�k k�zben az online kapcsolat a t�bbi j�t�kossal socket kommunik�ci�n kereszt�l fog m?k�dni. 
A backendet �s a hozz� tartoz� h�tt�rlogik�t NestJS keretrendszer seg�ts�g�vel fogom implement�lni, REST API-n kereszt�l.
Az adatok perzisztens t�rol�s��rt az SQLite adatb�zis kezel? felel. 
Az adatb�zis legfontosabb eleme a j�t�kosokat �s azok adatait elt�rol� t�bla lesz.
Itt t�rol�dik a nev�k, e-mail c�m�k, a hashelt jelszavuk, az �sszes pontsz�muk, a heti pontsz�muk, illetve szerepk�r�k.
Ezek alapj�n a szerepk�r t�bl�ban az lesz t�rolva.
Ezen k�v�l lesz egy heti eredm�nyeket tartalmaz� t�bla, hogy melyik h�ten ki volt az els? 10 legeredm�nyesebb j�t�kos.
A div�zi�k t�rol�s�ra is lesz egy t�bla. 
Tov�bb� egy el?zm�nyeket tartalmaz� t�bl�ban el�rhet? lesz a j�t�kosok utols� n�h�ny m�rk?z�se, az azokban el�rt eredm�ny�k. 
Lesz egy admin fel�let is, ahova a j�t�kk�sz�t?k, hozz�j�rul�k jelentkezhetnek majd be. 
Itt ?k v�ltoztathatj�k a j�t�k sor�n �letbe l�p? t�bl�k kin�zet�t, a k�rty�kat, amiket a rendszer kih�z. 
A t�bbsz�r�s figyelmeztet�seket kapott j�t�kosokat �s azok �zenetv�lt�sait az adminok fel�lvizsg�lhatj�k, �s a jogosnak tal�lt jelent�seket elfogadhatj�k, ezzel v�gleg
megvonhatj�k egy j�t�kost�l a j�t�k �r�m�t.
Az adminok itt tudnak kinevezni m�sokat adminnak vagy hozz�j�rul�nak. 
A fejleszt�semet Visual Studio Code-ban fogom v�gezni, adatb�zis tall�z�nak DB Browser for SQLite programot fogok hasz�lni.
A fejleszt�s folyamatos nyomonk�vet�s�t egy online verzi�kezel? seg�ts�g�vel fogom v�gezni egy priv�t repositoryban.