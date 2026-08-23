# Casa Brasada

Sitio web de una casa de banquetes con foco en la **experiencia de asados**.

## Cómo verla

```bash
python3 -m http.server 4173
```

Abre [http://localhost:4173](http://localhost:4173).

## Personalizar

Edita `js/config.js`:

- Número de WhatsApp (sin signos, con 57)
- Dirección, correo y horarios
- Enlaces de Instagram, Facebook y TikTok

## Cotizador

En `cotizar.html` el visitante elige el valor del plato. Con **$40.000** el menú queda:

- 250 g de carne de res
- 2 papas saladas
- 1 yuca
- 1 arepa asada
- 1 cerveza o 2 gaseosas

La cotización se envía por WhatsApp.

## Navegadores y redes

- PWA: se puede instalar desde Chrome, Edge o Safari (icono y `manifest.webmanifest`)
- SEO: `sitemap.xml`, `robots.txt` y datos estructurados
- Al compartir el enlace, Facebook e Instagram usan `assets/social/og-image.jpg`

Para que las redes **sugieran** la marca, crea las cuentas `@casabrasada` y pega la bio de la página de contacto.
