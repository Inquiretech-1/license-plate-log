# Contributing to the master log

This document explains how you can propose updates to the **shared master log** kept in this repository by opening a **pull request** on GitHub.

The master log is the canonical, version-controlled record that maintainers merge from trusted contributions. Your personal notes in the app stay on your device unless you export them and contribute through this process.

## Before you contribute

- Read the [README](README.md): be **accurate**, avoid **false accusations**, and respect **local laws** and **official reporting** channels.
- Only submit data you believe is **factual** and **appropriately described**. Maintainers may decline or edit contributions that do not meet project standards.

## How to submit a pull request (summary)

1. **Fork** this repository to your own GitHub account (or clone if you already have write access and use a branch—see your team’s policy).

2. **Create a branch** for your contribution, for example:  
   `git checkout -b add-plates-2026-04-02`

3. **Add or update the master log** in the way the project defines (for example a JSON file such as `master-log.json`, or another file named in the repository).  
   - If the app exports **JSON**, you can merge new entries into the existing structure and resolve duplicate `id` fields carefully.  
   - Keep the **CSV column names** unchanged if you use CSV (`plate`, `when_iso`, etc.) so imports remain compatible.

4. **Commit** your changes with a clear message, for example:  
   `Add master log entries from April 2026 observations`

5. **Push** your branch to GitHub and open a **Pull Request** into the default branch (usually `main`).

6. In the PR description, briefly explain **what** you are adding and **why** it belongs in the master log. Respond to review questions from maintainers.

7. After **approval**, a maintainer will **merge** your PR. If changes are needed, update your branch and push again.

## Technical tips

- Use the same Git remote pattern your team uses (for example SSH with a host alias if you use multiple GitHub accounts—see [github-ssh-inquiretech.md](github-ssh-inquiretech.md) if applicable).
- Prefer **small, focused PRs** so reviewers can verify entries more easily.

---

## Contribuir al registro maestro (español)

Este documento explica cómo puedes proponer cambios al **registro maestro compartido** de este repositorio abriendo una **pull request** en GitHub.

El registro maestro es el historial canónico bajo control de versiones que los mantenedores integran a partir de contribuciones confiables. Tus notas personales en la aplicación siguen en tu dispositivo salvo que las exportes y las aportes con este proceso.

## Antes de contribuir

- Lee el [README](README.md): sé **preciso**, evita **acusaciones falsas** y respeta las **leyes locales** y los **canales oficiales** de denuncia.
- Solo envía datos que consideres **veraces** y **bien descritos**. Los mantenedores pueden rechazar o editar contribuciones que no cumplan las normas del proyecto.

## Cómo enviar una pull request (resumen)

1. Haz un **fork** de este repositorio en tu cuenta de GitHub (o clona si ya tienes permisos de escritura y usas una rama, según las reglas de tu equipo).

2. **Crea una rama** para tu contribución, por ejemplo:  
   `git checkout -b add-plates-2026-04-02`

3. **Añade o actualiza el registro maestro** según lo defina el proyecto (por ejemplo un archivo JSON como `master-log.json`, u otro nombre indicado en el repositorio).  
   - Si la app exporta **JSON**, puedes fusionar entradas nuevas en la estructura existente y resolver con cuidado los `id` duplicados.  
   - Mantén los **nombres de columnas CSV** si usas CSV (`plate`, `when_iso`, etc.) para que la importación siga siendo compatible.

4. **Haz commit** de los cambios con un mensaje claro, por ejemplo:  
   `Add master log entries from April 2026 observations`

5. **Sube** la rama a GitHub y abre una **Pull Request** hacia la rama por defecto (normalmente `main`).

6. En la descripción del PR explica **qué** añades y **por qué** corresponde al registro maestro. Responde a las revisiones de los mantenedores.

7. Tras la **aprobación**, un mantenedores hará el **merge**. Si piden cambios, actualiza tu rama y vuelve a subir.

## Consejos técnicos

- Usa el mismo patrón de remoto que tu equipo (por ejemplo SSH con un alias si tienes varias cuentas de GitHub—véase [github-ssh-inquiretech.md](github-ssh-inquiretech.md) si aplica).
- Prefiere **PR pequeñas y concretas** para facilitar la revisión.
