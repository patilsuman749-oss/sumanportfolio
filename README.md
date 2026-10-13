# Suman Patil Portfolio

A dark, editorial-style student developer portfolio built with plain HTML, CSS and JavaScript.
Same theme as before, now with a frosted-glass motion layer and a detail page for every project.

## Pages
| File | What it is |
|---|---|
| `index.html` | Home: hero, about, projects, how I work, education, contact |
| `scorex.html` | ScoreX case study (new) |
| `flopcorn.html` | FLOP CORN case study |
| `pragya-ai.html` | PRAGYA AI case study |

## What's new
- **Glass system** (`.glass` in `style.css`): frosted panels with a cursor-following highlight and a shine sweep on hover.
- **Hero**: headline words rise out of a blur, floating glass chips and orbs around the portrait.
- **Ambient background**: slow drifting colour blobs so the glass has something to refract.
- **Projects**: glass cards with 3D tilt artwork, a "New" badge, and a "View case study" link.
- **Detail pages**: overview, feature cards, tech chips, process timeline that draws as you scroll, next-project card.
- **Page transitions**: frosted wipe between pages.
- Respects `prefers-reduced-motion`.

## Editing a project page
Detail pages are generated from one data file, but they are plain HTML, so you can also edit them directly.
Each page follows the same sections: hero, overview, features, (brand or tech), process, quote, next project.
Add a live link for ScoreX or PRAGYA AI by adding a button to the `p-actions` block, like the one on `flopcorn.html`.

## Personal links
- Email: patilsuman749@gmail.com
- GitHub: patilsuman749-oss
- LinkedIn: patilsuman749
- Instagram: patilsuman.749

## Run
Open `index.html` with VS Code Live Server or directly in a browser.
