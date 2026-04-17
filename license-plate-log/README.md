# License plate log

A simple app for **recording license plates** you associate with **unsafe driving**—for example behavior that seems **reckless** or that **endangered** another driver, cyclist, or pedestrian.

Use it as a **personal log** (what you saw, when, and where), with optional export/import so you can back up or move your data.

## Project layout

```text
license-plate-log/
  frontend/          # Static UI (open index.html or serve via backend)
  backend/           # Node.js server (serves frontend + /api)
  master-log.json    # Starter shared registry (same shape as app export)
  CONTRIBUTING.md    # How to propose changes to the master log
```

## Prerequisites

- **Browser only:** any modern browser (for opening the HTML file or using the served app).
- **Backend:** [Node.js](https://nodejs.org/) 18 or newer (for `npm` and the dev server).

## Run the frontend (no server)

Open `frontend/index.html` in a browser (double-click or **File → Open**). Data stays in **localStorage** unless you export it; see the in-app text for export/import.

## Run the backend (serves the app + API)

From the repository root:

```bash
cd license-plate-log/backend
npm install
cp .env.example .env   # optional; defaults work for local dev
npm start
```

Then visit [http://localhost:3000](http://localhost:3000) (or the `PORT` in `.env`). The UI is the same static app; `GET /api/health` returns a small JSON status payload.

For auto-restart on file changes (Node 18+):

```bash
npm run dev
```

## Shared master log

This folder includes **[master-log.json](master-log.json)**: the **starter shared registry** (same JSON shape as the app’s export). Import it in the app to load those entries, or propose changes via pull request—see [CONTRIBUTING.md](CONTRIBUTING.md).

## For anyone who contributes or uses shared data

- **Be accurate.** Record what you actually observed; avoid guessing or filling in details you are not sure about.
- **Avoid false accusations.** Wrong or exaggerated entries can harm innocent people and may have legal consequences depending on where you live.
- **Use official channels when appropriate.** Many places have traffic or police reporting options; this tool is not a substitute for those processes.

Laws and norms around recording plates and sharing observations **vary by jurisdiction**. You are responsible for how you use this information.

## Language

The interface supports **English** and **Spanish** (toggle in the header).

---

## README en español

# Registro de placas

Una aplicación sencilla para **anotar placas** que asocies con **conducción insegura**—por ejemplo conductas **temerarias** o que **pusieron en peligro** a otro conductor, ciclista o peatón.

Úsala como **registro personal** (lo que viste, cuándo y dónde), con exportación/importación opcional para respaldar o mover tus datos.

## Estructura del proyecto

```text
license-plate-log/
  frontend/          # Interfaz estática (abre index.html o el servidor)
  backend/           # Servidor Node (sirve el frontend + /api)
  master-log.json    # Registro compartido inicial (mismo formato que la exportación)
  CONTRIBUTING.md    # Cómo proponer cambios al registro maestro
```

## Requisitos

- **Solo navegador:** cualquier navegador reciente.
- **Backend:** [Node.js](https://nodejs.org/) 18 o superior.

## Ejecutar el frontend (sin servidor)

Abre `frontend/index.html` en el navegador. Los datos se guardan en **localStorage** salvo que los exportes.

## Ejecutar el backend

Desde la raíz del repositorio:

```bash
cd license-plate-log/backend
npm install
cp .env.example .env   # opcional
npm start
```

Abre [http://localhost:3000](http://localhost:3000). `GET /api/health` devuelve estado en JSON.

## Registro maestro compartido

Este directorio incluye **[master-log.json](master-log.json)**. Impórtalo en la aplicación o propón cambios con *pull request*—véase [CONTRIBUTING.md](CONTRIBUTING.md).

## Para quienes contribuyen o comparten datos

- **Sé preciso.** Anota lo que realmente observaste; evita suposiciones o completar detalles de los que no estés seguro.
- **Evita acusaciones falsas.** Entradas equivocadas o exageradas pueden perjudicar a personas inocentes y tener consecuencias legales según el lugar donde vivas.
- **Usa los canales oficiales cuando corresponda.** En muchos sitios existen denuncias de tráfico o policía; esta herramienta **no** las sustituye.

Las leyes y normas sobre registrar placas y compartir observaciones **varían según la jurisdicción**. Tú eres responsable del uso que hagas de esta información.

## Idioma

La interfaz está disponible en **inglés** y **español** (selector en la parte superior).
