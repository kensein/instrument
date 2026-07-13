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
npm install
npm run dev
# → http://127.0.0.1:3011/instrument/
```

Admin default password: `psimkg-admin`

## Server deploy dengan PM2 (`/var/www/instrument`)

Server production memakai **PM2** (bukan wajib systemd).

### Setup pertama kali

```bash
cd /var/www/instrument
# atau: git clone https://github.com/kensein/instrument.git /var/www/instrument

cp .env.example .env
cp .env.api.example .env.api
# edit .env dan .env.api (ADMIN_PASSWORD, CORS, dll.)

npm ci
npm run build

# Pastikan pm2 terpasang: npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # ikuti perintah yang dicetak (systemd hook)
```

Proses PM2:

- `instrument-web` → Next.js di `127.0.0.1:3011`
- `instrument-api` → API di `127.0.0.1:8011`

### Update (pull berikutnya)

```bash
cd /var/www/instrument
git pull origin master
npm ci
npm run build
pm2 reload ecosystem.config.cjs
# atau: pm2 restart instrument-web instrument-api
pm2 save
```

### Cek status

```bash
pm2 status
pm2 logs instrument-web --lines 50
pm2 logs instrument-api --lines 50
```

### Alternatif systemd

File `deploy/instrument-web.service` dan `deploy/instrument-api.service` tetap tersedia jika suatu saat tidak memakai PM2. **Jangan jalankan PM2 dan systemd bersamaan** untuk service yang sama.

## Apache (tambahkan di vhost portal **sebelum** catch-all `:3001`)

```apache
ProxyPass        /instrument/api/ http://127.0.0.1:8011/
ProxyPassReverse /instrument/api/ http://127.0.0.1:8011/
ProxyPass        /instrument      http://127.0.0.1:3011/instrument
ProxyPassReverse /instrument      http://127.0.0.1:3011/instrument
```

### CSP (wajib untuk Next.js)

CSP ketat portal (`script-src 'self'`, dan Cloudflare menambah `nonce-…`) **memblokir** inline script Next.js → jam kosong, login admin gagal, `Connection closed`.

Aplikasi ini **mengirim CSP-nya sendiri dengan nonce** lewat `src/proxy.ts` (pola resmi Next.js: `script-src 'self' 'nonce-…' 'strict-dynamic'`). Yang perlu dilakukan di server hanya: **Apache berhenti menimpa CSP untuk `/instrument`**, agar header CSP dari Next diteruskan.

Di vhost HTTPS, kecualikan `/instrument` dari CSP portal:

```apache
SetEnvIf Request_URI "^/instrument" instrument_path

# Pada baris CSP portal yang sudah ada, tambahkan env=!instrument_path:
# Header always set Content-Security-Policy "…csp-portal…" env=!embed_path env=!instrument_path
```

Jika CSP portal di-set global, override di vhost (cukup unset — Next yang mengatur):

```apache
<LocationMatch "^/instrument">
    Header always unset Content-Security-Policy
    Header unset Content-Security-Policy
</LocationMatch>
```

```bash
sudo apache2ctl configtest && sudo systemctl reload apache2
```

Verifikasi (browser sungguhan, bukan curl): DevTools → Network → header respons `/instrument/admin/login` → `Content-Security-Policy` harus memuat `script-src 'self' 'nonce-…' 'strict-dynamic'` (nonce dari Next). Jika masih hanya `script-src 'self'`, Apache masih menimpa.

Cloudflare: fitur **JavaScript Detections / Bot Fight Mode** menambah nonce sendiri — tetap kompatibel dengan nonce Next. Jika masih diblokir, nonaktifkan "JavaScript Detections" (Security → Bots) untuk domain ini. Lihat `deploy/apache-instrument.conf`.

Jangan overwrite seluruh vhost live — hanya sisipkan ProxyPass + penyesuaian CSP.

## Navigasi lintas-app

Header/footer meniru portal PSIMKG. Menu portal memakai `<a href="/...">` same-origin (bukan Next `Link`). Item **Instrument** aktif di `/instrument/`.

## Logo

`public/bmkg-logo.png`
