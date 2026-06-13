import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.enats.dorcas',
  appName: 'Dorcas',
  webDir: 'dist',
  server: {
    allowNavigation: [
      "dorcasaid.com",
      "*.dorcasaid.com",
      "secure.ccavenue.com",
      "*.ccavenue.com"
    ]
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
