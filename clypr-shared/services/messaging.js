// @flow
import firebase from '../../services/firebase';

import {AccountService} from './account';
import {DatabaseService} from './database';
import {Observable} from '../models/utils';
import * as Models from "../models/dataModels";

const messaging = firebase.messaging();

type NotificationObserver = (message: Models.NotificationMessage) => void;
type Observers = { id: string, callback: NotificationObserver }[];

const _observers: Observers = [];

export class MessagingService {

  static initialize() {
    MessagingService._trackTokenRefresh();
    MessagingService._trackNotification();
  }

  static _trackTokenRefresh() {
    // Get current user
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      if (isLoggedIn && user && user.id) {
        messaging.requestPermissions();

        messaging.getToken().then((token) => {
          DatabaseService.setDocumentByPath(`user/${user.id}/pushToken`, token).then(() => {
            messaging.onTokenRefresh((token) => {
              DatabaseService.setDocumentByPath(`user/${user.id}/pushToken`, token).then(() => {
              })
            })
          })
        })
      }
    });
  }

  static _trackNotification() {
    // Get current user
    messaging.onMessage((message) => {
      MessagingService._notify(message);
    });
  }

  static _notify(message: Models.NotificationMessage) {
    _observers.forEach(entry => {
      entry.callback(message);
    });
  }

  static _unsubscribe(subscriptionId: string) {
    const index = _observers.findIndex(entry => entry.id === subscriptionId);
    if (index > -1) {
      _observers.splice(index, 1);
    }
  }


  static observeNotification(callback: NotificationObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.push({id, callback});


    // Return unsubscribe method
    return {
      unsubscribe: () => {
        MessagingService._unsubscribe(id);
      }
    };
  }


}

MessagingService.initialize();
