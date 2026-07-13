# Instrument PSIMKG — Deploy

Aplikasi katalog instrumen untuk **Pusat Standardisasi Instrumen MKG (PSIMKG)**.

## Production URLs

| Layanan | Bind | Publik |
|---------|------|--------|
| Frontend (Next.js) | `127.0.0.1:3011` | https://psimkg.bmkg.go.id/instrument/ |
| API | `127.0.0.1:8011` | https://psimkg.bmkg.go.id/instrument/api/ |

`basePath` / `NEXT_PUBLIC_BASE_PATH` = `/instrument`

## Local development

```bash
cp .env.example .env.local
# Optional: leave NEXT_PUBLIC_API_URL empty / point to /instrument/api on same Next process
npm install
npm run dev
# → http://127.0.0.1:3011/instrument/
```

Admin default password: `psimkg-admin`

## Server deploy (`/var/www/instrument`)

```bash
cd /var/www/instrument
cp .env.example .env
cp .env.api.example .env.api
# edit secrets
npm ci
npm run build
sudo cp deploy/instrument-web.service /etc/systemd/system/
sudo cp deploy/instrument-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now instrument-web instrument-api
```

## Apache (tambahkan di vhost portal **sebelum** catch-all `:3001`)

```apache
ProxyPass        /instrument/api/ http://127.0.0.1:8011/
ProxyPassReverse /instrument/api/ http://127.0.0.1:8011/
ProxyPass        /instrument      http://127.0.0.1:3011/instrument
ProxyPassReverse /instrument      http://127.0.0.1:3011/instrument
```

Lalu:

```bash
sudo apache2ctl configtest && sudo systemctl reload apache2
```

Jangan overwrite seluruh vhost live — hanya sisipkan blok di atas.

## Navigasi lintas-app

Header/footer meniru portal PSIMKG. Menu portal memakai `<a href="/...">` same-origin (bukan Next `Link`), agar Apache mengarahkan ke portal atau sub-app lain (`/meteorologi`, `/p3dn/`, `/psiidn/`, dll.). Item **Instrument** aktif di `/instrument/`.

## Logo

Salinan logo portal: `public/bmkg-logo.png`
