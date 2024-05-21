# Changelog

Diese Datei enthält alle (wichtigen) Änderungen zu Dateien & dem Discord-Bot in diesem Github Repository. Für Änderungen zum Server schau bitte in die Datei "SERVER-CHANGELOG.md".

Das Format basiert auf [Führe ein Changelog](https://keepachangelog.com/en/1.1.0/),
und das Projekt haftet an ["Semantic Versioning"](https://semver.org/spec/v2.0.0.html).

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
