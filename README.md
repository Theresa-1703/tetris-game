> Hinweis:
> Dieses Projekt wurde als Experiment mittels „Vibecoding“ mit GitHub Copilot umgesetzt, um die Zusammenarbeit mit KI über den gesamten Entwicklungsablauf zu evaluieren.
> Ziel war es, Architektur- und Technologieentscheidungen, Produktivität und Codequalität in einem realistischen Monorepo-Setup zu prüfen.

---

# Tetris (React + TypeScript + Vite)

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

## Steuerung im Spiel
- Links/Rechts: Pfeiltasten oder A/D
- Rotieren: Pfeil hoch / W / X (im Uhrzeigersinn), Z oder Strg (gegen Uhrzeigersinn)
- Soft Drop: Pfeil runter oder S
- Hard Drop: Leertaste
- Pause: P

## Repo-Struktur
```
.
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ src/
   ├─ App.tsx           # UI/State-Integration, Rendering (Board, Ghost, Next-Preview)
   ├─ main.tsx          # App-Einstiegspunkt
   ├─ styles.css        # moderne Styles
   └─ game/             # reine Spiel-Engine
      ├─ board.ts       # Board-Operationen, Kollisionsprüfung
      ├─ constants.ts   # Konstanten (Größen, Punkte, SRS-Daten)
      ├─ engine.ts      # Tetris-Loop, Ticks, Input-Handling, Scoring
      ├─ rng.ts         # 7-Bag RNG
      ├─ sound.ts       # einfache WebAudio-Sounds
      ├─ tetromino.ts   # Tetromino-Shapes/Rotationen (SRS inkl. I-Kicks)
      └─ types.ts       # Typen
```

## Voraussetzung
- Node.js >= 18

## Installation
```cmd
npm install
```

## Entwicklung starten
Startet den Vite-Dev-Server.
```cmd
npm run dev
```
Öffne anschließend: http://localhost:5173

## Build
Erzeugt das Produktions-Bundle unter `dist/`.
```cmd
npm run build
```

## Vorschau eines Builds
Servt das `dist/`-Verzeichnis lokal.
```cmd
npm run preview
```
