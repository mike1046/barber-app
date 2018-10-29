// @flow
import stripe from 'tipsi-stripe'
import {AccountService} from './account';
import {DatabaseService} from './database';
import type {StripeCard} from "../models/dataModels";
import * as Models from '../models/dataModels';
import type {Observable} from '../models/utils';
import {Utilities} from './utilities';
import {Stripe} from '../../styles/global'

type SourcesObserver = (sources: Models.StripeSource[]) => void;
type Observers = { payments: { id: string, callback: SourcesObserver }[] };
type ObservableData = { payments: Models.StripeSource[] };

const _observers: Observers = {sources: []};
const _data: ObservableData = {sources: [], defaultSourceId: null};
let _sourceListObserver: ?Observable;
let _defaultSourceObserver: ?Observable;

const _brandImages = {
  'Visa': require('../../assets/payment-methods/1.png'),
  'MasterCard': require('../../assets/payment-methods/2.png'),
  'Maestro': require('../../assets/payment-methods/3.png'),
  'Cirrus': require('../../assets/payment-methods/4.png'),
  'PayPal': require('../../assets/payment-methods/5.png'),
  'Western Union': require('../../assets/payment-methods/6.png'),
  'Visa Electron': require('../../assets/payment-methods/7.png'),
  'Amazon': require('../../assets/payment-methods/8.png'),
  'WorldPay': require('../../assets/payment-methods/9.png'),
  'Diners Club': require('../../assets/payment-methods/10.png'),
  'Unknown1': require('../../assets/payment-methods/11.png'),
  'Skrill': require('../../assets/payment-methods/12.png'),
  'Sage': require('../../assets/payment-methods/13.png'),
  'Discover': require('../../assets/payment-methods/14.png'),
  'SkrillMoneybookers': require('../../assets/payment-methods/15.png'),
  'JCB': require('../../assets/payment-methods/16.png'),
  'EBay': require('../../assets/payment-methods/17.png'),
  'EWay': require('../../assets/payment-methods/18.png'),
  'Unknown2': require('../../assets/payment-methods/19.png'),
  'Solo': require('../../assets/payment-methods/20.png'),
  'DirectDebit': require('../../assets/payment-methods/21.png'),
  'American Express': require('../../assets/payment-methods/22.png'),
  'Shopify': require('../../assets/payment-methods/23.png'),
  'Unknown3': require('../../assets/payment-methods/24.png'),
  'Unknown': require('../../assets/payment-methods/24.png'),
}

/** Manage payment methods. */
export class PaymentMethodService {

  static initialize() {
    stripe.init({
      publishableKey: Stripe.publishableKey
    })

    // Monitor data
    PaymentMethodService._trackAllSources();
  }

  /** Listen for all sources associated with current user. */
  static _trackAllSources() {
    // Get current user
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      if (isLoggedIn && user && user.id) {
        if (_sourceListObserver) {
          // Unsubscribe previous observer
          _sourceListObserver.unsubscribe();
        }

        _defaultSourceObserver = DatabaseService.observeDocumentByPath(`stripeCustomer/${user.id}/default_source`, (defaultSourceId: string) => {
          _data.defaultSourceId = defaultSourceId;
          // set isDefault flag on all cards
          _data.sources = _data.sources.map((source: Models.StripeCard) => {
            source.isDefault = (source.id === defaultSourceId);
            return source;
          })
          PaymentMethodService._notify('sources');
        })

        _sourceListObserver = DatabaseService.observeDocumentByPath(`stripeCustomer/${user.id}/sources/data`, (sources: ?Models.StripeCard[]) => {
          if (sources) {
            sources = sources.map((source: Models.StripeCard) => {
              source.isDefault = (source.id === _data.defaultSourceId);
              source.brandImage = _brandImages[source.brand]
              return source;
            })
            _data.sources = sources
          }
          else {
            _data.sources = [];
          }
          PaymentMethodService._notify('sources');
        })
      } else {
        // User is logged out
        _data.sources = [];
        PaymentMethodService._notify('sources');
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

  static async removeSource(source: Models.StripeCard): Promise<boolean> {
    const user = AccountService.getCurrentUser();
    if (user) {

      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/Payment-removeSource', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(source)
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

  static async setDefault(source: Models.StripeCard): Promise<boolean> {
    const user = AccountService.getCurrentUser();
    if (user) {

      return new Promise((resolve, reject) => {
        AccountService.getFirebaseToken().then(authToken => {
          fetch(Utilities.API + '/Payment-setDefault', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(source)
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

  static async addSource(): Promise<boolean> {
    const options: Models.PaymentRequestWithCardOptions = {
      requiredBillingAddressFields: 'zip',
    }

    try {

      const user = AccountService.getCurrentUser();
      if (user) {
        const token = await stripe.paymentRequestWithCardForm(options)

        return new Promise((resolve, reject) => {
          AccountService.getFirebaseToken().then(authToken => {
            fetch(Utilities.API + '/Payment-addSource', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
              },
              body: JSON.stringify(token)
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
    catch (e) {
      console.log('e: ', e)
    }
  }

  static getDefaultSource(): ?StripeCard {
    const index = _data.sources.findIndex(source => source.id === _data.defaultSourceId)

    if (index > -1) {
      return _data.sources[index]
    }
    return null
  }

  /** Observe all payments associated with current user. */
  static observeAllSources(callback: SourcesObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.sources.push({id, callback});

    // Send first data
    callback(_data.sources);

    // Return unsubscribe method
    return {
      unsubscribe: () => {
        PaymentMethodService._unsubscribe('sources', id);
      }
    };
  }

}

// Initialize data monitoring
PaymentMethodService.initialize();
