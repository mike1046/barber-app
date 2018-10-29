// @flow
import { AccountService } from './account';
import { DatabaseService } from './database';
import * as Models from '../models/dataModels';
import type { Observable } from '../models/utils';

type PaymentsObserver = (payments: Models.Payment[]) => void;
type Observers = { payments: { id: string, callback: PaymentsObserver }[] };
type ObservableData = { payments: Models.Payment[] };

const _observers: Observers = { payments: [] };
const _data: ObservableData = { payments: [] };

/** Manage payments history. */
export class PaymentsService {

  static initialize() {
    // Monitor data
    PaymentsService._trackAllPayments();
  }

  /** Listen for all payments associated with current user. */
  static _trackAllPayments() {
    // Get current user
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      if (isLoggedIn && user && user.id) {
        // Load all payments for current user
        DatabaseService.observeDocumentByPath('payment/'+user.id, (data: { [id: string]: Models.Payment }) => {
          // Convert to a list and use payments
          const payments = [];
          if (data) {
            Object.keys(data).forEach(id => payments.push( data[id] ));
          }
          
          // Sort payments, earlier first
          payments.reverse();
          
          // Update data
          _data.payments = payments;
          PaymentsService._notify('payments');
        });
      } else {
        // User is logged out
        _data.payments = [];
        PaymentsService._notify('payments');
      }
    });
  }

  /** Notify changes to observers of data. */
  static _notify(type: string) {
    _observers[type].forEach(entry => { entry.callback(_data[type]); });
  }

  /** Remove an observer of data. */
  static _unsubscribe(type: string, subscriptionId: string) {
    const index = _observers[type].findIndex(entry => entry.id === subscriptionId);
    if (index > -1) { _observers[type].splice(index, 1); }
  }


  /** Observe all payments associated with current user. */
  static observeAllPayments(callback: PaymentsObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.payments.push({ id, callback });

    // Send first data
    callback(_data.payments);

    // Return unsubscribe method
    return { unsubscribe: () => { PaymentsService._unsubscribe('payments', id); }};
  }

}

// Initialize data monitoring
PaymentsService.initialize();
