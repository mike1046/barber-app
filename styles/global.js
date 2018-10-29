// @flow
import Config from 'react-native-config';

/** Export reusable variables. */
export const Variables = {
  primaryColor: '#25aae1',
  primaryColorTransparent: 'rgba(37, 170, 225, 0.8)',

  primaryLightColor: '#ebf3f6',
  primaryDarkColor: '#d1d9dc',

  dangerColor: '#ff3b30',
  TabBarIconSize: 26,

  grey: '#666',
  darkGrey: '#333',
  lightGrey: '#999',
  disabledGrey: '#ccc',
  backgroundGrey: '#eee',

  nativeBaseFloatingFormFieldLabel: '#777',
  nativeBaseFormFieldBorder: '#D9D5DC',
  nativeBaseBackground: '#E9E9EF',
  nativeBasePrimaryColor: '#057AFB'
};

/** Set global styles to be reused everywhere on the app. */
export const Styles = {

  primaryColor: {
    color: Variables.primaryColor
  },

  nativePrimaryColor: {
    color: Variables.nativeBasePrimaryColor
  },

  primaryBackground: {
    backgroundColor: Variables.primaryColor
  },

  dangerColor: {
    color: Variables.dangerColor
  },

  section: {
    padding: 10
  },

  subFooter: {
    alignItems: 'center',
    backgroundColor: Variables.primaryLightColor
  },

  title: {
    fontSize: 16,
    textAlign: 'center',
    margin: 40
  },

  listItemSides: {flex: 0},
  listItemBody: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center'
  },

  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },

  form: {},
  input: {
    marginLeft: 0
  },
  inputLabelFloating: {},
  submit: {
    backgroundColor: Variables.primaryColor,
    marginVertical: 20
  },
  submitText: {
    color: 'white'
  }

};

export const Firebase = {
  appConfig: {
    clientId: Config.FIREBASE_CLIENT_ID,
    appId: Config.FIREBASE_APP_ID,
    apiKey: Config.FIREBASE_API_KEY,
    databaseURL: Config.FIREBASE_DATABASE_URL,
    projectId: Config.FIREBASE_PROJECT_ID,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  },
  apiUrl: Config.FIREBASE_API_URL
}

export const Stripe = {
  clientId: Config.STRIPE_CLIENT_ID,
  publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
}

