import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.icewhistle.app',
  appName: 'ICEwhistle',
  webDir: 'out', // For static export, or use server URL below

  // Use the live server URL (recommended for dynamic Next.js apps)
  server: {
    // Production: Use your Vercel URL
    url: 'https://icewhistle.app',
    // For local development, comment out the above and use:
    // url: 'http://localhost:3000',
    cleartext: false, // Only allow HTTPS in production
  },

  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'ICEwhistle',
    // Recommended for App Store
    limitsNavigationsToAppBoundDomains: true,
  },

  // Android specific configuration
  android: {
    // Use Android WebView chrome for better compatibility
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Disable in production
  },

  // Plugins configuration
  plugins: {
    // Push Notifications
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // Splash Screen
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F172A', // Match your app's background
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Status Bar
    StatusBar: {
      style: 'DARK', // Light text for dark background
      backgroundColor: '#0F172A',
    },

    // Keyboard
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
