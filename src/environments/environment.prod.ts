export const environment = {
  production: true,
  staging: false,
  development: false,
  appName: 'Quran Apps Directory',
  appUrl: 'https://hajapps.org',
  apiUrl: 'https://api.hajapps.org/api',
  version: '1.0.0',
  analytics: {
    enabled: false,
    // trackingId: 'G-XXXXXXXXXX' // Replace with actual GA4 tracking ID
    trackingId: ''
  },
  features: {
    debugMode: false,
    logging: false,
    showStagingBanner: false,
    enableServiceWorker: false
  },
  sentry: {
    enabled: false,
    // dsn: 'https://10ae32f7f36add568917f16d53562358@o4510669335232512.ingest.de.sentry.io/4510669357842512',
    dsn: '',
    // tunnel: 'https://qad-backend-api-production.up.railway.app/api/sentry-tunnel/',
    tunnel: '',
    environment: 'production',
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0
  }
};
