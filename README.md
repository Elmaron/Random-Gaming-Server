# RandomGamingServer

Hier gibt es detailierte Updates zum Server & den Code des Discord-Bots.

In CHANGELOG.md findet ihr alle Änderungen zum Bot und der Dateien hier auf Github, während Änderungen am Server selbst in SERVER-CHANGELOD.md zu finden sind.

Um es mir selbst etwas einfacher bei der Entwicklung zu machen, habe ich dem Bot Administratorberechtigungen auf dem Server gegeben. Er kann damit mehr oder weniger alles auf dem Server machen, was eben programmiert ist. Damit ihr allerdings Gewissheit darüber behalten könnt, ob ich eure Daten klaue oder irgendwie auslese, habe ich beschlossen, den Code hier auf Github frei zugänglich zu machen. Vor der ersten fertigen und veröffentlichten Version findet ihr allerdings keine Erklärungen im Code selbst, da ich den erst später hinzugefügt habe.
Der Code steht euch ansonsten frei zur Verfügung, ihr könnt ihn auch gerne herunterladen und damit euren eigenen Serverbot entwickeln. Wollt ihr es euch einfach machen, würde ich euch empfehlen, nichts in dem Ordner "Structures" anzufassen und darauf aufbauend nur im Ordner Events Dinge abzuändern und Commands (im Ordner Commands) hinzuzufügen. Achtung: Nehmt ihr Änderungen an message.js vor, passt auf, nicht versehentlich etwas zu löschen, da ggf. sonst keine normalen Befehle mehr ausgeführt werden können.
Übrigens befindet sich das Token nicht im Code, nur der Standort, auf den zugegriffen wird (damit es für Fremde Zwecke nicht ausgelesen und missbraucht werden kann!). Diese Datei sieht in etwa so inhaltlich aus:

```json
{
    "DiscordAPI": {
        "token": "<Discord-Token>",
        "prefix": "<Bot-Prefix>",
        "owners": [ "<User-Id>" ],
    },
    "TwitchAPI": {
        "client_id": "<Client-id>",
        "client_secret": "<Client-secret>"
    }
}
```

Ihr müsst nur `<Inhalt>` durch den jeweiligen Inhalt ersetzen und den Verweis auf die Datei korrigieren, wenn ihr auf der Basis meines Codes euren eigenen Discord-Bot schreiben möchte. Falls ihr Fragen zu den jeweiligen Sektionen habt, schreibt mich gerne direkt an. 

Übrigens müsste ich an dieser Stelle auch Credits an ein YouTube-Video geben, mit dessen Hilfe ich den Quatsch hier damals entwickelt habe und auf dem das Meiste meines Codes basiert. Allerdings muss ich diese Tutorial-Reihe erst einmal wiederfinden und werde den Namen und die Playlist hier hinzufügen, sobald ich diese gefunden habe.
