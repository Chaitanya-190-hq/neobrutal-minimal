# 📜 Chai Archive Logbook

A personal digital preservation system for archiving memories, achievements, projects, certificates, and life events. All data stays securely in your browser — no backend, no accounts, no external services.

## ✨ Features

| Feature | Details |
|---|---|
| **Archive CRUD** | Create, edit, delete, and restore archive entries |
| **Auto-Generated IDs** | `CA-0001`, `CA-0002`, ... format |
| **11 Categories** | Learning, Python, Programming, Certificates, Personal, Milestones, Projects, Discord, Chai Archive, Future Vault, Other |
| **Star Rating** | 1–5 importance with interactive stars |
| **Mood Selection** | 10 mood options with emojis |
| **Tags System** | Comma-separated tags with card display |
| **Future Messages** | Write letters to your future self |
| **Search & Filters** | By title, category, tags, ID, description, importance, sort |
| **Archive Cards** | Beautiful stamped cards with vintage branding |
| **PNG Export** | High-quality archive card images |
| **PDF Export** | A4-format document export |
| **QR Code Generation** | Scannable QR codes with full metadata |
| **JSON Export/Import** | Single-archive and full backup |
| **Future Vault** | Secure reference system with `FV-0001` IDs, serials, accounts |
| **Timeline View** | Chronological journey through your archives |
| **Dashboard** | Stats, category distribution, importance overview |
| **Dark Mode** | Toggle with persisted preference |
| **Print Mode** | Print-friendly card view |
| **Responsive** | Works on desktop, tablet, and mobile |

## 🚀 Deploy to GitHub Pages

This project is fully static and ready for GitHub Pages deployment.

### Option 1: Deploy via GitHub Pages UI

1. Push this repository to GitHub
2. Go to your repo **Settings > Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose the branch (e.g., `main`) and root (`/`) as the folder
5. Click **Save**

Your site will be live at `https://<username>.github.io/<repository>/`

### Option 2: Deploy via GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
```

### How it works

Simply open `index.html` in any browser — no build step, no server, no dependencies. All data is stored locally in your browser's `localStorage`.

## 🎨 Design Theme

- **Style:** Ancient archive meets modern dashboard
- **Palette:** Antique paper, warm beige, dark brown, gold accents
- **Typography:** Playfair Display (headings), Inter (body), Courier Prime (mono)
- **Effects:** Parchment textures, archive stamps, preservation labels

## 🛠 Built With

- Vanilla HTML, CSS, JavaScript
- [html2canvas](https://html2canvas.hertzen.com/) — PNG & PDF export
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) — QR code generation
- [Google Fonts](https://fonts.google.com/) — Playfair Display, Inter, Courier Prime

## 💾 Data Privacy

All data is stored exclusively in your browser's `localStorage`. Nothing is ever sent to any server. Your archives remain entirely under your control.

## 📄 License

MIT
