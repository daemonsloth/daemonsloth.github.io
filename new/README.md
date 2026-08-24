# Public Profile — Refactored

The site keeps the same terminal-style UI and interaction model, but the profile content is now separated from the application logic.

## Where to edit your profile

Most updates belong in `profile-content.js`:

- `PROFILE.identity` — name, role, location, focus, social/resume links, bio text
- `PROFILE.ui` — navigator labels, terminal copy, footer/status text
- `PROFILE.about` — the two About cards
- `PROFILE.experience` — work history entries
- `PROFILE.research` — research/IP cards
- `PROFILE.projects` — projects and links
- `PROFILE.skills` — skills
- `PROFILE.recognition` — awards/recognition
- `PROFILE.education` — education entries
- `PROFILE.files` — profile sections/files shown in the navigator and terminal

You normally should not need to edit `app.js` just to change profile content.

## What changed structurally

- `profile-content.js` contains data only.
- `app.js` contains rendering and interaction behavior.
- Navigation, directory listing, help, and tree output all derive from `PROFILE.files`.
- Repeated cards, projects, experience entries, skills, and education are rendered from arrays instead of hand-written HTML for every item.
- `index.html` contains only the static application shell.

## Running it

Open `index.html` from a static web server as before. No build step or framework is required.

Example:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/`.

## Profile photo

The home page photo is `profile-photo.png`. To replace it, keep the same filename or update `identity.photo.src` in `profile-content.js`. The photo presentation (size, border, spacing, and responsive behavior) lives in `styles.css`.
