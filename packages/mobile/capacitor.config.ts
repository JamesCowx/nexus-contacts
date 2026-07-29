import { defineConfig } from '@capacitor/cli';

export default defineConfig({
  appId: 'com.contacts.app',
  appName: 'Contacts',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#121212',
    },
  },
});
