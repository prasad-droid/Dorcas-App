import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.psmcodes.dorcasaid',
  appName: 'Dorcas',
  webDir: 'dist',
  server: {
    allowNavigation: [
      "dorcasaid.com",
      "*.dorcasaid.com",
      "secure.ccavenue.com",
      "*.ccavenue.com"
    ]
  }
};

export default config;
