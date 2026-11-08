# SUPERARMAGEDDON

> A personal digital universe by Lukkas.

**SUPERARMAGEDDON** is the working title for a personal website reimagined as a fictional desktop operating system. It brings together Lukkas' profile, interests, music, collections, and hidden interactions inside an immersive, interactive environment.

The visual direction takes inspiration from the dark, futuristic atmosphere of aespa's *Armageddon* era: deep blacks, metallic details, sharp forms, restrained violet light, and atmospheric motion. It is not intended to imitate an existing operating system.

## Project status

🚧 **In development — OS foundation scaffolded**

The initial React + TypeScript + Vite foundation has been merged into `main`. The multi-window manager is being developed on the `feat/window-manager` branch. The previous website remains in the separate [`lukkas`](https://github.com/lowkeylukkas/lukkas) repository and is not modified.

The current build is an early interface shell. The feature modules listed below are planned goals; they are not all implemented yet.

## Experience

The goal is to create one experience that adapts to desktop and mobile:

- **Desktop:** a full interactive environment with a desktop, app launcher, taskbar, widgets, and application windows.
- **Mobile:** a touch-friendly app launcher, full-screen app views, and mobile navigation rather than a shrunken desktop layout.
- **Startup:** an optional cinematic boot sequence and interactive login, with a way to skip directly to the desktop.
- **Atmosphere:** animated wallpaper, subtle effects, and reduced-motion support.

## Planned features

The original site's personality and interactive features are important to this project. The redesign aims to preserve and evolve all of them:

1. **Achievements** — clickable achievements, unlock conditions, and saved progress.
2. **Easter eggs** — hidden interactions and surprises to discover.
3. **Bible feature** — a dedicated space for Bible verses and related interactions.
4. **Roll My Vibe** — a playful random-vibe feature.
5. **Music player** — favorite tracks and playback controls.
6. **K-pop collection** — favorite groups, artists, and media.
7. **Games and characters** — favorite games and characters.
8. **Phainon profile picture** — the animated profile image and personal identity.
9. **Social links** — links to Lukkas' social profiles.
10. **Personal information** — an about/profile area.
11. **Compliments and surprises** — small interactive extras.

## Design direction

- Dark, cinematic, futuristic, and expressive.
- Black, charcoal, violet, and metallic accents.
- Angular geometry and distinctive typography.
- Atmospheric animation used with restraint.
- No Frutiger Aero or bubbly glassmorphism direction.
- Inspired by a visual mood, not affiliated with or endorsed by aespa or its label.

## Technology

- React + TypeScript
- Vite
- CSS design system and responsive layouts
- Browser storage for local preferences and achievement progress (planned)

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
npm run preview
```

## Achievement system

The eight original secret IDs and trigger conditions are preserved. Achievement progress uses the existing `lukkas_ach_*` local-storage keys so unlocked secrets can carry over from the original site in the same browser. New unlocks are saved locally; no account or server sync is included yet.

## Development roadmap

- [x] Set up the React + TypeScript + Vite foundation.
- [x] Establish the first design tokens and visual direction.
- [x] Build the first responsive desktop and mobile shells.
- [x] Implement multiple application windows, focus, dragging, minimizing, maximizing, and taskbar restore.
- [x] Add the eight original achievements, clickable locked/unlocked entries, unlock notifications, and local progress persistence.
- [ ] Recreate the remaining original site's features and interactions.
- [ ] Add startup, login, settings, and accessibility options.
- [ ] Test across desktop and mobile browsers.
- [ ] Configure deployment.

## Credits and media

This is an independent personal project. Any third-party names, artwork, characters, music, and media belong to their respective owners. Their appearance in the project does not imply affiliation or endorsement. Media will be credited where appropriate.

---

Made with care by **Lukkas**.
