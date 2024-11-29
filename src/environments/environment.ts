// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://194.163.138.25:5001/api/',
  imageUrl: 'http://194.163.138.25:5001/api/utils/download/',
  serverUrl: 'http://194.163.138.25:5001',
  mapBoxToken:
    'pk.eyJ1IjoidmljYiIsImEiOiJjaXd5anphYjkwMTdkMm9waGp5YTFtbzAwIn0.uWsqw4D7sUH6deObhhQAiA',
  opengraphToken: '17f88be1-55ae-4107-a6fe-fb5576c43074',
  firebaseConfig: {
    apiKey: 'AIzaSyAABXQ20G64FzUNTTo1EqMK8h6D9FIhiNk',
    authDomain: 'onepick-14ef4.firebaseapp.com',
    projectId: 'onepick-14ef4',
    storageBucket: 'onepick-14ef4.appspot.com',
    messagingSenderId: '29835938124',
    appId: '1:29835938124:web:8fe4322f7df383f87fa7e9',
    measurementId: 'G-FL6XWT071D',
  },
  linksScrap: ['amazon'],

  imageLy: {
    license: 'F-AKdBVPpoSfG-bYHU1TAnm_uL6QHJT6z2WNBVhdrmreVoC-4lJP0a4QEF2zNgT5',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.38.0/assets',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
