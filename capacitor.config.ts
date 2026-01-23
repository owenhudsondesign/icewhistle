import type { CapacitorConfig } from '@capacitor/cli';

const isProd = process.env.NODE_ENV === 'production';

const config: CapacitorConfig = {
  appId: 'org.icewhistle.app',
  appName: 'ICEwhistle',
  webDir: 'out',

  // Only logs in debug builds, not production
  loggingBehavior: 'debug',

  // Server configuration
  server: {
    // Production: Use live Vercel URL
    // Development: Comment out url or use localhost
    url: isProd ? 'https://icewhistle.app' : 'https://icewhistle.app',
    cleartext: false,
    androidScheme: 'https',
  },

  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'ICEwhistle',
    limitsNavigationsToAppBoundDomains: true,
  },

  // Android specific configuration
  android: {
    allowMixedContent: false,
    captureInput: true,
    // IMPORTANT: Must be false for production App Store builds
    webContentsDebuggingEnabled: !isProd,
  },

  // Plugins configuration
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },

    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
    },

    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
