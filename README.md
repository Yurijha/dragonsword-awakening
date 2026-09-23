# DragonSword: Awakening — website concept

Independent presentation concept by Dev Uriane. Original HTML, CSS and JavaScript inspired by the cinematic section-based navigation of NTE. No NTE code, branding, music, authentication, or analytics is included.

## Preview
Unzip the project and open `index.html` in a browser. No installation or build is needed. The images and video are bundled locally; Google Fonts requires internet and has system-font fallbacks.

## Publish on GitHub Pages
1. Create or choose the destination repository.
2. Place `index.html`, `styles.css`, `script.js`, `.nojekyll`, and the `assets` directory at the repository root. Commit to `main`.
3. In Settings → Pages, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
4. Wait for the Pages deployment to finish and open the URL shown in that panel.

Relative asset paths support a GitHub project URL without modification. Do not place the enclosing project folder inside the repository root.

GitHub reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Included interactions
- Four cinematic sections with anchor navigation and active section markers.
- Mobile navigation, world scene selector, three character spotlights.
- Muted background video with pause/play control and reduced-motion preference support.
- Trailer excerpt dialog with keyboard dismissal and a full-trailer link to Steam.
- Steam destination buttons; no fake purchase, registration, or login flows.

## Editing
Content: `index.html`. Colors/layout: `styles.css`. Scene and character mapping: `script.js`. Replace game imagery in `assets` while retaining names, or update the mappings.

## Assets and scope
Game imagery and video belong to HOUND13 and their respective owners. These are official Steam promotional materials used for this independent presentation concept; no ownership or reuse license is claimed. The title is a typography treatment, not an official logo asset. Character spotlights use official gameplay thumbnails rather than transparent character renders. The bundled video is a 24-second muted excerpt, not the full trailer. See `ASSET-SOURCES.json` for provenance.

## Validation
JavaScript syntax and local HTML asset references checked. Media downloads verified. Browser visual/interaction QA and live GitHub Pages deployment have not yet been completed.
