import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.onepick.ma',
  appName: 'One Pick',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // serverClientId: '359961056471-bh5e8ok78ts5tub7o0ubilsasfjgakcp.apps.googleusercontent.com',
      serverClientId:
        '29835938124-8rho19mt1mc2nlmpbfihrjp6jgr1ima8.apps.googleusercontent.com',
      forceCodeForRefreshToken: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['phone', 'google.com'],
    },
  },
};

export default config;
