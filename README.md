# RandomGamingServer
 Hier gibt es detailierte Updates zum Server & den Code des Discord-Bots.

 In CHANGELOG.md findet ihr alle �nderungen zum Bot und der Dateien hier auf Github, w�hrend �nderungen am Server selbst in SERVER-CHANGELOD.md zu finden sind.

 Um es mir selbst etwas einfacher bei der Entwicklung zu machen, habe ich dem Bot Administratorberechtigungen auf dem Server gegeben. Er kann damit mehr oder weniger alles auf dem Server machen, was eben programmiert ist. Damit ihr allerdings Gewissheit dar�ber behalten k�nnt, ob ich eure Daten klaue oder irgendwie auslese, habe ich beschlossen, den Code hier auf Github frei zug�nglich zu machen. Vor der ersten fertigen und ver�ffentlichten Version findet ihr allerdings keine Erkl�rungen im Code selbst, da ich den erst sp�ter hinzugef�gt habe.
 Der Code steht euch ansonsten frei zur Verf�gung, ihr k�nnt ihn auch gerne herunterladen und damit euren eigenen Serverbot entwickeln. Wollt ihr es euch einfach machen, w�rde ich euch empfehlen, nichts in dem Ordner "Structures" anzufassen und darauf aufbauend nur im Ordner Events Dinge abzu�ndern und Commands (im Ordner Commands) hinzuzuf�gen. Achtung: Nehmt ihr �nderungen an message.js vor, passt auf, nicht versehentlich etwas zu l�schen, da ggf. sonst keine normalen Befehle mehr ausgef�hrt werden k�nnen.
 �brigens befindet sich das Token nat�rlich nicht im Code, nur der Standort, auf den zugegriffen wird. Diese Datei sieht in etwa so inhaltlich aus:

{
	"token": "<Discord-Token>",
	"prefix": "<Bot-Prefix>",
	"owners": [ "<User-Id>" ]
}

Ihr m�sst nur <Inhalt> durch den jeweiligen Inhalt ersetzen und den Verweis auf die Datei korrigieren, wenn ihr auf der Basis meines Codes euren eigenen Discord-Bot schreiben m�chte.

�brigens m�sste ich an dieser Stelle auch Credits an ein YouTube-Video geben, mit dessen Hilfe ich den Quatsch hier damals entwickelt habe und auf dem das Meiste meines Codes basiert. Allerdings muss ich diese Tutorial-Reihe erst einmal wiederfinden und werde den Namen und die Playlist hier hinzuf�gen, sobald ich diese gefunden habe.