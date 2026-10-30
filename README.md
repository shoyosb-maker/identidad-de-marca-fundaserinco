# Fundaserinco — Brand Hub & Design System v1.0

SPA estática que unifica el manual de marca en tres secciones:

1. **Marca y logo** (`#brand-overview-and-logo-anatomy`)
2. **Colorimetría y paletas** (`#colorimetry-and-palettes`)
3. **Tipografía y componentes** (`#typography-and-scale`) + anclas `#ui-components`, `#stationery-mockups`

## Cómo visualizar localmente

Es una web estática, puedes abrirla de dos formas:

### Opción A — Servidor local (recomendado)

```bash
# con Python 3
python3 -m http.server 8000

# o con Node (npx)
npx serve .
```

Luego abre `http://localhost:8000`.

### Opción B — Abrir el archivo

Doble clic en `index.html`. Funciona igual porque todos los recursos son locales (solo las fuentes vienen de Google Fonts).

## Características

- **Navegación SPA** por hash, con soporte de deep-links a anclas internas.
- **Bilingüe ES / EN**: español por defecto, selector en el header. La preferencia se guarda en `localStorage` (`fs-lang`); el inglés vive en el HTML y el español en `js/i18n.js`.
- **Modo claro / oscuro**: sigue la preferencia del sistema en la primera visita, botón en el header y persistencia en `localStorage` (`fs-theme`).
- **Identidad corporativa** en el chrome (header, nav, footer, toggles): tipografía Albert Sans, azul `#2456d6` y paleta oscura `#0f1019` del sitio corporativo. El contenido del manual conserva sus tokens documentados (Tech Blue / Solar Coral / Plus Jakarta Sans).
- **Tarjeta al compartir**: metadatos Open Graph/Twitter con imagen `assets/img/og-fundaserinco.jpg` (1200×630) para que WhatsApp, LinkedIn y X muestren la vista previa de marca.
- **Descargas de marca**: `download` nativo sobre los PNG transparentes de `assets/img`.
- **Tokens como variables CSS**: `js/tailwind.config.js` mapea la paleta del manual a `rgb(var(--c-*) / <alpha-value>)`, definida en `css/styles.css` para tema claro y oscuro.

## Estructura

```
index.html            Estructura + contenido de las 3 secciones
css/styles.css        Tokens (claro/oscuro), chrome corporativo, toggles
js/tailwind.config.js Paleta del manual como variables CSS
js/i18n.js            Diccionario ES (clave = texto original en inglés)
js/main.js            Router SPA, idioma, tema, portapapeles
assets/img/           Logo transparente (logo-fundaserinco, logo-simbolo, logo-simbolo-512, logo-wordmark) + set de favicons
```

## Notas

- El logo se usa con transparencia (`assets/img/logo-fundaserinco.png`, `logo-simbolo.png`, `logo-wordmark.png`); no hay fondos blancos en las piezas.
- **Descarga de logos**: en Marca y logo, el botón del hero y cada variante (A–D) descargan el PNG transparente en su máxima resolución disponible (logo completo 640×382, isotipo 480×438, logotipo 613×60). El resto de acciones copian tokens o código al portapapeles.
