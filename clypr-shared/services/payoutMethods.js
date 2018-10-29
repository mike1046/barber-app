// @flow
import stripe from 'tipsi-stripe'
import {AccountService} from './account';
import {DatabaseService} from './database';
import * as Models from '../models/dataModels';
import type {Observable} from '../models/utils';
import {Utilities} from './utilities';
import {Stripe} from '../../styles/global'

type BankAccountObserver = (bankAccounts: Models.StripeBankAccount[]) => void;
type Observers = { bankAccounts: { id: string, callback: BankAccountObserver }[] };
type ObservableData = { bankAccounts: Models.StripeBankAccount[] };

const _observers: Observers = {bankAccounts: []};
const _data: ObservableData = {bankAccounts: [], defaultSourceId: null};
let _bankAccountListObserver: ?Observable;

/** Manage payout methods. */
export class PayoutMethodService {

  static initialize() {
    stripe.init({
      publishableKey: Stripe.publishableKey
    })

    // Monitor data
    PayoutMethodService._trackAllBankAccounts();
  }

  /** Listen for all bank accounts associated with current user. */
  static _trackAllBankAccounts() {
    // Get current user
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      if (isLoggedIn && user && user.id) {
        if (_bankAccountListObserver) {
          // Unsubscribe previous observer
          _bankAccountListObserver.unsubscribe();
        }

        _bankAccountListObserver = DatabaseService.observeListByPath(`barber/${user.id}/bankAccounts`,
          (added: ?Models.StripeBankAccount) => {
            _data.bankAccounts.push(added)
            PayoutMethodService._notify('bankAccounts');
          }, (deleted: ?Models.StripeBankAccount) => {
            const deletedIndex = _data.bankAccounts.findIndex(account => account.id === deleted.id)
            if (deletedIndex > -1) {
              _data.bankAccounts.splice(deletedIndex, 1)
              PayoutMethodService._notify('bankAccounts');
            }
          })
      } else {
        // User is logged out
        _data.bankAccounts = [];
        PayoutMethodService._notify('bankAccounts');
      }
    });
  }

  /** Notify changes to observers of data. */
  static _notify(type: string) {
    _observers[type].forEach(entry => {
      entry.callback(_data[type]);
    });
  }

  /** Remove an observer of data. */
  static _unsubscribe(type: string, subscriptionId: string) {
    const index = _observers[type].findIndex(entry => entry.id === subscriptionId);
    if (index > -1) {
      _observers[type].splice(index, 1);
    }
  }

  static async removeBankAccount(account: Models.StripeBankAccount): Promise<boolean> {
    const user = AccountService.getCurrentUser();
    if (user) {

      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/Payout-removeBankAccount', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(account)
          }).then(response => {
            if (response.ok) {
              resolve(true)
            } else {
              reject();
            }
          }).catch(reject);
        }).catch(reject);
      });
    }
  }

  static async setDefaultBankAccount(account: Models.StripeBankAccount): Promise<boolean> {
    const user = AccountService.getCurrentUser();
    if (user) {

      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/Payout-setDefaultBankAccount', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(account)
          }).then(response => {
            if (response.ok) {
              resolve(true)
            } else {
              reject();
            }
          }).catch(reject);
        }).catch(reject);
      });
    }
  }

  static async addBankAccount(params: Models.BankAccountDetails): Promise<Models.StripeBankAccount> {
    try {

      const user = AccountService.getCurrentUser();
      if (user) {
        const token = await stripe.createTokenWithBankAccount(params)

        return new Promise((resolve, reject) => {
          AccountService.getFirebaseToken().then(authToken => {
            fetch(Utilities.API + '/Payout-addBankAccount', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
              },
              body: JSON.stringify(token)
            }).then(response => {
              console.log('response: ', response)
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
    catch (e) {
      console.log('e: ', e)
    }
  }

  static async getLoginUrl(): Promise<string> {
    const user = AccountService.getCurrentUser();
    if (user) {

      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/createLoginLink', {
            method: 'GET',
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

  // static getDefaultBankAccount(): ?Models.StripeBankAccount {
  //   const index = _data.bankAccounts.findIndex(account => account.id === _data.defaultSourceId)
  //
  //   if (index > -1) {
  //     return _data.bankAccounts[index]
  //   }
  //   return null
  // }

  /** Observe all bank accounts associated with current user. */
  static observeAllBankAccounts(callback: BankAccountObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.bankAccounts.push({id, callback});

    // Send first data
    callback(_data.bankAccounts);

    // Return unsubscribe method
    return {
      unsubscribe: () => {
        PayoutMethodService._unsubscribe('bankAccounts', id);
      }
    };
  }

}

// Initialize data monitoring
PayoutMethodService.initialize();
