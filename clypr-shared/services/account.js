// @flow
import firebase from '../../services/firebase';
import { DatabaseService } from './database';
import { StorageService } from '../../services/storage';
import { Observable } from '../models/utils';
import * as Models from '../models/dataModels';
import { Alert } from '../../services/alert';

let _isLoggedIn = false;
let _currentUserInfo: ?Models.User = null;
let _userInfoObserver: ?Observable;

type LoginStateObserver = (isLoggedIn: boolean, user?: Models.User) => void;
const _observers: { id: string, callback: LoginStateObserver }[] = [];

/** Manages user's login and profile information. */
export class AccountService {

  /** Listen for Firebase login state and load full user data. */
  static initialize() {
    // Observe login changes from Firebase
    firebase.auth().onAuthStateChanged(user => {
      const uid = user && user.uid;

      // Observe user information
      if (uid) {
        if (!_userInfoObserver ||
            !_currentUserInfo ||
            (_currentUserInfo.id !== uid)) {
          // App has just loaded or user id has changed. Observe user data.
          if (_userInfoObserver) {
            // Unsubscribe previous observer
            _userInfoObserver.unsubscribe();
          }

          // Observer current user data
          _userInfoObserver = DatabaseService.observeDocumentByPath('user/'+uid, userInfo => {
            // User info was fetched or updated. Use it.
            _currentUserInfo = userInfo;
            _isLoggedIn = true;

            AccountService._notifyChanges();
            AccountService._persistLogin();
          });
        } else {
          // State login has triggered again, but no need to create a new database observer.
        }
      } else {
        // No user is logged in
        _currentUserInfo = null;
        _isLoggedIn = false;
        if (_userInfoObserver) { _userInfoObserver.unsubscribe(); }
        
        AccountService._notifyChanges();
        AccountService._persistLogin();
      }
    });
  }

  /** Get Firebase token for login on external services. */
  static getFirebaseToken(): Promise<string> {
    const user = firebase.auth().currentUser;
    return user ? user.getIdToken() : Promise.resolve('');
  }

  /** Try to login a user with a type of credentials. Returns user information. */
  static loginWithService(service: string, credentials: Object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Choose service to use for login
      if (service === 'email') {
        // Login with an email and password
        const email = credentials.email;
        const password = credentials.password;

        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
          // Success
          resolve(true);
        }).catch(error => { reject(`Error ${error.code}: ${error.message}`); });
      } else {
        // Service is not supported
        reject('Service not supported');
      }
    });
  }

  /** Register a new user using email and password. */
  static registerWithEmail(email: string, password: string, name: string, role: 'barber' | 'client'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Validate fields
      if (email && password) {
        // Create a new account
        firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
          const id = user.uid;

          // Create custom user info associated with this firebase user id
          const newUser: Models.User = {
            id,
            role,
            profile: {
              name,
              avatarUrl: ''
            },
            configs: {},
            appointments: [],
            favoriteIds: {},
            pushTokens: []
          };

          DatabaseService.setDocumentByPath('user/'+id, newUser).then(() => {
            // If user is a barber, create a Barber profile with the same id
            if (role === 'barber') {
              const newBarber: Models.Barber = {
                id,
                ownerUserId: id,
                rating: 0,
                mediaGallery: [],
                profile: {
                  name,
                  avatarUrl: ''
                },
                acceptedPaymentMethods: { inAppPayment: false },
                services: []
              };

              DatabaseService.setDocumentByPath('barber/'+id, newBarber).catch(err => {
                // Error creating barber profile. Try again
                DatabaseService.setDocumentByPath('barber/'+id, newBarber).catch(err => {
                  // Error repeated. Show to user.
                  Alert.show('Could not create your barber profile. Update your profile to try again. Error:' + err.code + ' - ' + err.message);
                });
              });
            }

            // Success
            resolve(true);
          }).catch(reject);
        }).catch(error => { reject(`Error ${error.code}: ${error.message}`); });
      } else {
        reject('missing credentials');
      }
    });
  }

  /** Check user login state. */
  static isLoggedIn(): boolean {
    return _isLoggedIn;
  }

  /** Return current user information. */
  static getCurrentUser(): ?Models.User {
    return _currentUserInfo;
  }

  /** Subscribe for updated current user information. Returns unsubscribe method. */
  static observeCurrentUser(callback: LoginStateObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.push({ id, callback });

    // Send first data
    callback(_isLoggedIn, _currentUserInfo);

    // Return subscription
    return {
      unsubscribe: () => { AccountService._unsubscribeUserObserver(id); }
    };
  }

  /** Unsubscribe for updates on login state, based on a subscription id. */
  static _unsubscribeUserObserver(subscriptionId: string) {
    const index = _observers.findIndex(entry => entry.id === subscriptionId);
    if (index > -1) { _observers.splice(index, 1); }
  }

  /** Load persisted user login data, if any. */
  static async loadDataAsync() {
    _isLoggedIn = await StorageService.read('isLoggedIn');
    _currentUserInfo = await StorageService.read('userData');
  }

  /** Logout current user. */
  static logout() {
    firebase.auth().signOut().then(() => {
      StorageService.reset();
    }).catch(err => { Alert.show(err); });
  }

  /** Update account profile. */
  static updateAccountProfile(profile: Models.UserProfile): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Validate data
      if (profile && profile.name) {
        // Add default avatar if needed
        if (!profile.avatarUrl) { profile.avatarUrl = ''; }

        // Get current user id and role
        const user = AccountService.getCurrentUser();
        const uid = user && user.id;
        const role = user && user.role;

        if (uid) {
          // Prepare updates
          const updates = {};

          // Update profile on User entry
          updates[`user/${uid}/profile`] = profile;

          // Update barber shop profile, if needed
          if (role === 'barber') { updates[`barber/${uid}/profile`] = profile; }

          // Perform updates
          DatabaseService.updateDocuments(updates).then(resolve).catch(reject);
        } else {
          // Could not find current user
          reject('Please login first.');
        }
      } else {
        // Invalid data
        reject('Invalid profile data provided.');
      }
    });
  }

  /** Change account password. */
  static changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Get current user
      const user = firebase.auth().currentUser;
      if (user && user.email) {
        // User is logged in
        if (oldPassword && newPassword) {
          // Reauthenticate user
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
          user.reauthenticateWithCredential(credential).then(() => {
            // User re-authenticated.
            user.updatePassword(newPassword).then(() => { resolve(true); }).catch(reject);
          }, reject);
        } else {
          reject('Missing data');
        }
      } else {
        reject('Please login first');
      }
    });
  }

  /** Delete current account. */
  static deleteAccount(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Get current user
      const user = firebase.auth().currentUser;
      if (user && user.email) {
        // User is logged in
        if (password) {
          // Reauthenticate user
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
          user.reauthenticateWithCredential(credential).then(() => {
            // User re-authenticated. Perform account deletion
            user.delete().then(resolve).catch(reject);
          }, reject);
        } else {
          reject('Missing data');
        }
      } else {
        reject('Please login first');
      }
    });
  }

  /** Set if a user is preferred to current user, such as favorite barbers or preferred clients. */
  static setPreferredUser(userId: string, isFavorite: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId && isFavorite !== null) {
        // Get current user
        const user = AccountService.getCurrentUser();
        if (user) {
          // Set user favorite status
          DatabaseService.setDocumentByPath(
            `user/${user.id}/favoriteIds/${userId}`,
            isFavorite ? true : null
          ).then(resolve).catch(reject);
        } else {
          reject('Please login first');
        }
        // Update client on current user data
      } else {
        reject('Missing data');
      }
    });
  }

  /** Check if current user is favorite by a second user. */
  static isPreferredUserFor(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Get current user
      const user = AccountService.getCurrentUser();
      if (user) {
        DatabaseService.getDocumentByPath(`user/${userId}/favoriteIds/${user.id}`).then(hasFavoriteFlag => {
          resolve(hasFavoriteFlag || false);
        }).catch(reject);
      } else {
        // Current user is not logged in
        resolve(false);
      }
    });
  }

  // Notify about changes on login state
  static _notifyChanges() {
    _observers.forEach(entry => { entry.callback(_isLoggedIn, _currentUserInfo); });
  }

  // Persist login data when ready
  static _persistLogin() {
    const userData = {};

    if (_currentUserInfo) {
      // Store only some specific user data
      userData.id = _currentUserInfo.id;
      userData.role = _currentUserInfo.role;
      userData.appointments = _currentUserInfo.appointments;
      userData.authorization = _currentUserInfo.authorization;
    }

    StorageService.save('isLoggedIn', _isLoggedIn);
    StorageService.save('userData', userData);
  }
}

// Connect to Firebase and track login state
AccountService.initialize();
