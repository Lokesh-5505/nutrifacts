# NutriFacts

AI-powered food label analyzer demo web app.

NutriFacts helps users inspect packaged food ingredients and view:

- Harmful ingredient flags
- Health risk score
- Child safety guidance
- Health alerts by profile
- Healthier alternatives
- AI diet assistant (demo mode)

## Live Demo

After publishing with GitHub Pages, your site URL will be:

`https://<your-username>.github.io/<repo-name>/`

Example:
`https://ramlo.github.io/nutrifacts/`

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage for scan result persistence

## Project Structure

```text
nutrifacts/
  index.html
  scan.html
  results.html
  harmful-list.html
  harmful-explanation.html
  health-alerts.html
  alternatives.html
  ai-diet.html
  css/
    style.css
  js/
    main.js
    scanner.js
```

## Features

- Responsive UI for desktop and mobile
- Shared navbar/footer injection via `js/main.js`
- Demo scan flow from `scan.html` to `results.html`
- Ingredient database filtering (`harmful-list.html`)
- Personalized alerts based on user profile (`health-alerts.html`)
- AI chat assistant UI (`ai-diet.html`)

## Local Development

Because this is a static site, you can run it directly or use a local server.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Run a local static server (recommended)

If you have Node.js:

```bash
npx serve .
```

Or with Python:

```bash
python -m http.server 5500
```

Then open:
`http://localhost:5500`

## Publish with GitHub Pages

1. Push this folder to a public GitHub repository.
2. Open repository settings.
3. Go to **Settings -> Pages**.
4. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
5. Save and wait 1-2 minutes.

## Git Setup Commands

Run from the project root folder:

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: NutriFacts"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

If `.git` already exists, skip `git init`.

## Notes

- The AI analysis path is demo-oriented. If the external API is unavailable, fallback logic is used.
- This project is for educational use and is not medical advice.

## License

This project is provided for educational and portfolio use.
