# Changelog

Diese Datei enthält alle (wichtigen) Änderungen zu Dateien & dem Discord-Bot in diesem Github Repository. Für Änderungen zum Server schau bitte in die Datei "CHANGELOG-SERVER.md". Für Änderungen am Discord-Server schau bitte in die Datei "CHANGELOG-DISCORD.md".

Das Format basiert auf [Führe ein Changelog](https://keepachangelog.com/en/1.1.0/),
und das Projekt haftet an ["Semantic Versioning"](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- src/Twitch/index.js
  - Das Twitch Modul steht nun zur Verfügung. Die restlichen Teile wurden fast vollständig nach Plan implementiert (es fehlen timed events).

- src/index.js
  - Datei besitzt nun ein besseres Fehlerhandling für die Module und kann sie automatisch neustarten

- src/Discord/Structures/TimedEvent.js

  - Dient zur Erstellung von Ereignissen, die zu bestimmten Zeitpunkten oder nach einer bestimmten Zeit erneut ausgeführt werden sollen.
  - Noch nicht fertig implementiert, da sie noch nicht ganz funktionsfähig sind. Wird in nächster Zeit fertig gestellt.

- Timed Events
  - sendLiveMessage -> Bei einem Livestream eines bestimmten Kanals auf Twitch, kann der Bot eine Benachrichtigung auf Discord in einen zuvor ausgewählten Textkanal schicken.
  - upgradeRoles -> Der Bot verändert bestimmte Rollen nach einer Weile und kann so neue Berechtigungen für Mitglieder hinzufügen, die schon länger auf dem Server sind.

### Changed

- src/Discord/Events/ready.js

  - Die Livestreambenachrichtigung wurde erneut angepasst.

## [1.1.1] - 2024-06-25

### Added

- src/index.js

  - Diese Datei startet ab sofort den Bot für Discord und Twitch. (Mit diesem Update läuft der Twitch-Teil noch über die ready.js Funktion)

- "CHANGELOG-SERVER.md"

  - Gibt es Änderungen am Server oder seiner Art und Weise, Programmcode auszuführen, werden diese hier aufgelistet.

### Changed

- Die Ordnerstruktur wurde zugunsten der Nutzung von mehreren APIs zur gleichen Zeit komplett geändert.

- Die Datei "SERVER-CHANGELOG.md" wurde zu "CHANGELOG-DISCORD.md" umbenannt.

## [1.1.0] - 2024-06-22

### Security

- Einige Packages wurden geupdated, um Sicherheitsprobleme mit dem Bot bei der Verbindung zum Netz zu fixen.

### Fixed

- src/Events/ready.js
  
  - Die Rollen wurden in der Konsole nicht mit Namen angezeigt, wenn geprüft wird, ob bestimmte Leute diese Rolle bereits besitzen. Dieser Fehler ist nun behoben.

- src/Events/guildMemberAdd.js
  
  - Die Willkommensnachricht wird nun etwas verzögert verschickt, damit der Neuankömmling dies auch mitbekommt.

### Added

- Der Code enthält nun Kommentare, die die verschiedenen Funktionen der einzelnen Zeilen im Groben erläutern.

- src/Events/voiceStateUpdate.js
  
  - Wenn jemand in einem bestimmten Voicechat Live geht, wird dies nun auch im entsprechenden Announcement-Channel angezeigt. 

### Changed

- src/Events/ready.js
  
  - Die Live-Stream Message wurde ein bisschen überarbeitet.

## [1.0.1] - 2024-05-27

### Fixed

- src/Structures/MenuDocsClient.js
  
  - Die Bot-Besitzer wurden nicht richtig übernommen. Dieser Fehler ist jetzt behoben.

- src/Structures/Util.js
  
  - Auf Windows Systemen mag es egal sein, allerdings ist die Ordnerbezeichnung im Bezug auf die groß und Kleinschreibung für das auslesen des richtigen Ordners auf anderen Betriebssystemen sehr wichtig. Diese wurde nun korrigiert.

### Added

- Einige Server Logs werden nun beim Serverstart angezeigt und geben zusätzliche Informationen.

## [1.0.0] - 2024-05-26

### Added

- Datei: "server-config/RANDOM GAMING SERVER.json"
  - Die Konfigurationen des Servers sind ab sofort auch auf Github zu sehen.
- Mit diesem Update geht ein Server online, wodurch der Bot (außer bei Wartungen) 24/7 online ist. Ab sofort steht der Bot (und damit auch der Server) für Follower auf Twitch usw. zur Verfügung.

### Changed

- Datei: "config.json" (außerhalb des Githubs, siehe README.md)
  - Die Datei befindet sich nun an einem anderen Speicherort, um die Ordnerstruktur zu verbessern.
  - Die Datei enthält jetzt nur noch die Daten zum Anmelden in den jeweiligen APIs, für das Prefix und wer die Bot Autoren sind.
- src/
  - index.js
    - Ab sofort wird auf die neue "config.json" zugegriffen. (Discord API)
  - Structures/MenuDocsClient.js
    - Ab sofort wird auf die neue "config.json" zugegriffen. (von index.js)
  - src/Events
    - ready.js
      - Ab sofort wird auf die neue "config.json" zugegriffen. (Twitch API)
      - Die Daten für den Server werden jetzt aus "server-config/RANDOM GAMING SERVER.json" verarbeitet.
    - raw.js
      - Die Daten für den Server werden jetzt aus "server-config/RANDOM GAMING SERVER.json" verarbeitet.
    - guildMemberAdd.js
      - Die Daten für den Server werden jetzt aus "server-config/RANDOM GAMING SERVER.json" verarbeitet.

## [0.3.2] - 2024-05-25

### Fixed

- src/Events/guildMemberAdd.js
  
  - Die Nachricht, die einem der Bot anzeigt, enthielt einen Fehler im Link, sodass man nicht auf die Guidelines verwiesen wurde. Der Link funktioniert jetzt, wie erwartet.

- src/Events/message/messageDelete.js & src/Events/message/messageUpdate.js
  
  - Wenn eine Nachricht von einem User, der bereits den Server verlassen hat, gelöscht oder geändert wurde, ist der Bot durch die Fehlermeldung abgestürzt. Die Fehlermeldung selbst (der Autor der Nachricht sei nicht verfügbar) ist nicht soo schlimm, daher wurde nur das abstürzen des Bots vorerst umgangen.

## [0.3.1] - 2024-05-25

### Fixed

- src/Commands/restart.js
  
  - Der Bot ist im Help-Befehl einer falschen Kategorie zugeordnet worden (Adiministrator)

- src/Events/raw.js
  
  - Würde ein Bot auf die Nachricht mit dem richtigen Emoji reagieren, würde er ebenfalls eine Rolle zugewiesen bekommen. Allerdings sollen Bots nicht auf diese Weise Rollen für den Server bekommen können, deshalb wurde dies entfernt.

### Added

- Datei: "other content/Discord-Bot Profilbild.png" (other content wurde in diesem Zug ebenfalls erstellt)
  
  - Der Bot hat auf Discord jetzt ein Profilbild!

- In Datei: src/Events/ready.js
  
  - Der Bot liest nun von alleine die Guideline-Nachricht aus und schaut, ob dort bereits die erwünschte Reaktion vorhanden ist. Sollte diese fehlen, wird sie vom Bot hinzugefügt.
  
  - Der Bot kann nun Rollen upgraden! Ist jemand, der den Richtlinien zugestimmt hat und damit Zugriff auf den Server hat, eine gewisse Zeit auf dem Server mit dieser Rolle, wird seine Rolle automatisch geupgraded!

### Changed

- src/Event/ready.js
  
  - In der Livestream Benachrichtigung steht jetzt ein Link, mit dem man direkt dem Livestream beitreten kann.

- src/Event/guildMemberAdd.js
  
  - Die Willkommensnachricht für neue Mitglieder auf dem Server wurde angepasst.
    
    - Bots werden nun in Kurzform begrüßt.
    
    - Alle anderen werden nun freundlich begrüßt und dazu aufgefordert, die Server-Richtlinien zu akzeptieren.

- Der Server wurde etwas überarbeitet. (siehe SERVER-CHANGELOG.md)

## 

## [0.3.0] - 2024-05-23

### Added

- Datei: src/Commands/Admin/restart.js
  
  - dient dazu, den Bot herunterzufahren und alles neu zu starten (Commands, Events)
  
  - Befehl wird im gleichen Terminalfenster ausgeführt (wird das Terminal geschlossen, wird auch der neugestartete Bot geschlossen)

## [0.2.1] - 2024-05-22

### Fixed

- raw.js 
  
  - In der Konsole wurden die Rollennamen nicht korrekt angezeigt, wenn sie einer neuen Person zugewiesem wurden.

### Changed

- config.json
  
  - Die Inhalte wurden entsprechend an den Random Gaming Server angepasst. Außerdem wurde die Authentifizierung für Twitch ebenfalls in diese Datei kopiert, um die Abhängigkeiten zu anderen Dateien zu reduzieren.

- ready.js 
  
  - Die erforderlichen Authentifizierungscodes werden jetzt aus einer anderen Datei gezogen (config.json, nicht mehr twitch-config.json).
  
  - Des Weiteren wurde das Intervall, in dem geprüft wird, ob Streamer online sind, angepasst (von 20 Sekunden auf 2 Minuten).

- README.md 
  
  - Die Datei wurde entsprechend der Änderungen an twitch-config.json und config.json angepasst.

## [0.2.0] - 2024-05-22

### Added

- Datei: src/Events/raw.js
  
  - Event: Raw
    
    - dient zur Verarbeitung aller Veränderungen von Discord
    
    - kann bei Bedarf Rollen durch die Reaktion auf eine bestimmte Nachricht hinzufügen (bspw. wenn Guidelines mithilfe einer Reaktion bestätigt werden.)

### Changed

- ready.js >> Der Code wurde etwas angepasst, um sich die Informationen aus der überarbeiteten "config.json"-Datei zu holen.
- config.json >> Der Inhalt wurde etwas überarbeitet und dadurch übersichtlicher gestaltet.
- README.md >> Der Inhalt der config.json Datei wurde neu beschrieben.

## [0.1.1] - 2024-05-21

### Added

- ready.js >> Es wird überprüft, ob ein bestimmter Twitch-Kanal online ist und bei Bedarf eine Livestream-Benachrichtigung in einen bestimmten Kanal verschickt (privater Server)

- config.json (außerhalb des sichtbaren Bereichs) >> Es wurde ein weiterer Schlüssel hinzugefügt: twitch (siehe ReadMe-Datei für Verwendungszweck)

- Es wurde eine weitere Datei außerhalb des sichtbaren Bereichs hinzugefügt, mit dem auf eine Twitch-API zugegriffen werden kann, um Daten aus Twitch auszulesen (bspw.: Ist ein bestimmter Kanal gerade live?)

### Changed

- README.md wurde anhand der hinzugefügten Inhalte etwas angepasst.

## [0.1.0] - 2024-05-19

### Added

- Dateien
  - CHANGELOG.md
  - SERVER-CHANGELOG.md
- Code (alles im Ordner src)
  - index.py
  - start.ps1
  - Commands
    - Hello.js
    - Admins
      - reload.js
      - shutdown.js
    - Information
      - Botinfo.js
      - Serverinfo.js
      - userinfo.js
    - Utilities
      - Help.js
      - Ping.js
      - Uptime.js
  - Events
    - guildMemberAdd.js
    - ready.js
    - voiceStateUpdate.js
    - message
      - message.js
      - messageDelete.js
      - messageUpdate.js
  - Structures
    - Command.js
    - Event.js
    - MenuDocsClient.js
    - MenuDocsEmbed.js
    - Util.js
- node_modules (Alles von discord.js, was für den Bot benötigt wird)
