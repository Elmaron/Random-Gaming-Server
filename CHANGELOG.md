# Changelog

Diese Datei enth�lt alle (wichtigen) �nderungen zu Dateien & dem Discord-Bot in diesem Github Repository. F�r �nderungen zum Server schau bitte in die Datei "SERVER-CHANGELOG.md".

Das Format basiert auf [F�hre ein Changelog](https://keepachangelog.com/en/1.1.0/),
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
- node_modules (Alles von discord.js, was f�r den Bot ben�tigt wird)
