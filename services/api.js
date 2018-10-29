// @flow
import firebase from '../services/firebase';
import { Utilities } from '../clypr-shared/services/utilities';
import { AccountService } from '../clypr-shared/services/account';

/** Service to handle connection with remote API. */
export class API {

  static sendSupportMessage(message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Collect user details to send with message
      const user = AccountService.getCurrentUser();
      const login = firebase.auth().currentUser;
      const info = { user, login };
      
      // Create a contact request
      fetch(Utilities.API + '/contact', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, info })
      }).then(response => {
        if (response.ok) {
          // Success!
          resolve(true);
        } else {
          // Error
          reject('Could not send your message to support. Server error. Please try again later');
        }
      }).catch(err => {
        // Error
        reject('Could not send your message to support. Network error.');
      });
    });
  }

};
