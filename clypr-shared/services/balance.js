// @flow
import {AccountService} from './account';
import * as Models from '../models/dataModels';
import {Utilities} from './utilities';

export class BalanceService {
  static initialize() {
  }

  static async getBalance(): Promise<Models.StripeBalance> {
    const user = AccountService.getCurrentUser();
    if (user) {
      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/Payment-getBalance', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
          }).then(response => {
            if (response.ok) {
              resolve(response.json())
            } else {
              reject();
            }
          }).catch(reject);
        }).catch(reject);
      });
    }
  }

  static async getTransactions(data): Promise<Models.StripeTransaction[]> {
    const user = AccountService.getCurrentUser();
    if (user) {
      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/Payment-getTransactions', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (response.ok) {
              resolve(response.json())
            } else {
              reject();
            }
          }).catch(reject);
        }).catch(reject);
      });
    }
  }
}

// Initialize data monitoring
BalanceService.initialize();
