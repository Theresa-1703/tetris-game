# Tetris Modern (React + TypeScript + Vite)

Ein modernes, spielbares Tetris mit sauberer Trennung von Logik, Rendering und State-Management.

## Features
- 7-Bag Zufalls-Generator für faire Tetromino-Verteilung
- Bewegung: links/rechts, Rotation (SRS-Wallkicks inkl. I-Kicks)
- Fallgeschwindigkeit mit Level-Progression (alle 10 Linien)
- Linien-Erkennung und -Löschung, Punkte (Soft-/Hard-Drop, Linien je nach Anzahl)
- Game Over, Pause/Resume, Neustart
- Vorschau der nächsten Steine, Ghost Piece
- Moderne Optik (klare Farben, weiche Schatten/Animationen, responsive Sidebar)
- Einfache WebAudio-Soundeffekte (bewegung/rotation/drop/line)

## Steuerung
- Links/Rechts: Pfeiltasten oder A/D
- Rotieren: Pfeil hoch / W / X (im Uhrzeigersinn), Z oder Strg (gegen Uhrzeigersinn)
- Soft Drop: Pfeil runter oder S
- Hard Drop: Leertaste
- Pause: P

## Projektstruktur (Auszug)
- `src/game/` – reine Spiel-Engine (Board-Operationen, Kollisionsprüfung, SRS, Spawn, Clear, Scoring)
- `src/App.tsx` – UI/State-Integration, Keyboard-Handling, Rendering (Board, Ghost, Next-Preview)
- `src/styles.css` – moderne Styles
- `vite.config.ts` – Vite + React Plugin

## Voraussetzung
- Node.js >= 18

## Loslegen (Windows / cmd.exe)
```cmd
cd C:\Users\joana\Desktop\Projekte\tetris-game
npm install
npm run dev
```
Die Konsole zeigt die lokale URL (typisch http://localhost:5173/). Mit STRG+C beenden.

## Produktions-Build + Vorschau
```cmd
cd C:\Users\joana\Desktop\Projekte\tetris-game
npm run build
npm run preview
```
`npm run build` erzeugt das `dist/`-Verzeichnis, `npm run preview` servt es lokal.

## Hinweise / Troubleshooting
- Falls der Dev-Server-Port bereits belegt ist, zeigt Vite einen alternativen Port an.
- Sound: Wird per WebAudio erzeugt. Über den Button „Stumm/Ton an“ in der Sidebar kann stumm geschaltet werden.
- Der Code ist in TypeScript geschrieben; die Logik ist komplett unter `src/game/` gekapselt.

## Nächste kleine Ideen
- Speicherung der Highscores in LocalStorage
- Touch-Steuerung für Mobilgeräte
- Hintergrundmusik (deaktivierbar)

