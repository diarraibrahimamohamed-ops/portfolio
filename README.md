# Portfolio — Ibrahima Mohamed Diarra

Portfolio statique. Les fichiers à la racine (`index.html`, `style.css`, `script.js`) sont la version publiée : HTML et CSS minifiés, JavaScript obscurci.

Les sources lisibles sont dans `src/`. Après une modification :

```bash
npm install
npm run build
```

L'obscurcissement ne cache pas le contenu de la page, et le dossier `src/` reste lisible dans le dépôt. La protection réelle est la Content-Security-Policy (aucun script inline, origines limitées), les liens externes en `noopener noreferrer`, et les en-têtes du fichier `_headers`. Ce fichier est appliqué par Netlify et Cloudflare Pages. GitHub Pages l'ignore : les balises de sécurité dans `index.html` couvrent ce que le navigateur peut imposer sans en-tête HTTP.


