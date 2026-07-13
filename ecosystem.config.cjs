/**
 * PM2 ecosystem for PSIMKG Instrument
 * Frontend :3011  |  API :8011  |  bind 127.0.0.1
 *
 * Usage (on server):
 *   cd /var/www/instrument
 *   npm ci && npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: "instrument-web",
      cwd: "/var/www/instrument",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3011",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3011,
        HOSTNAME: "127.0.0.1",
        NEXT_PUBLIC_BASE_PATH: "/instrument",
        NEXT_PUBLIC_API_URL: "/instrument/api",
      },
    },
    {
      name: "instrument-api",
      cwd: "/var/www/instrument",
      script: "server/api.mjs",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        PORT: 8011,
        HOST: "127.0.0.1",
        CORS_ORIGIN: "https://psimkg.bmkg.go.id",
      },
    },
  ],
};
