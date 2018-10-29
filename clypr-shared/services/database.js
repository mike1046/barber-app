// @flow
import firebase from '../../services/firebase';
import type {Observable} from '../models/utils';

const database = firebase.database();

/** Manages operations on Firebase realtime database. */
export class DatabaseService {

  /* Return an observer for a document on a specific path. */
  static observeDocumentByPath(path: string, onUpdatedCallback: (doc: any) => void): Observable {
    const ref = database.ref(path);

    ref.on('value', (snapshot) => {
      onUpdatedCallback(snapshot.val());
    });

    // Return unsubscribe method
    return {unsubscribe: () => ref.off('value', onUpdatedCallback)};
  }

  /* Return an observer for a list on a specific path. */
  static observeListByPath(path: string
    , onAddedCallback?: ?(doc: any, id?: string) => void
    , onRemovedCallback?: ?(doc: any, id?: string) => void
    , onChangedCallback?: ?(doc: any, id?:string) => void): Observable {
    const ref = database.ref(path);

    onAddedCallback && ref.on('child_added', (snapshot) => {
      onAddedCallback(snapshot.val(), snapshot.key);
    });

    onRemovedCallback && ref.on('child_removed', (snapshot) => {
      onRemovedCallback(snapshot.val(), snapshot.key);
    });

    onChangedCallback && ref.on('child_changed', (snapshot) => {
      onChangedCallback(snapshot.val(), snapshot.key);
    });

    // Return unsubscribe method
    return {
      unsubscribe: () => {
        onAddedCallback && ref.off('child_added', onAddedCallback)
        onRemovedCallback && ref.off('child_removed', onRemovedCallback)
        onChangedCallback && ref.off('child_changed', onChangedCallback)
      }
    };
  }

  /* Return a document on a specific path. */
  static getDocumentByPath(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = database.ref(path);

      ref.once('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  /* Create or update a document on a specific path. */
  static setDocumentByPath(path: string, value: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database.ref(path).set(value).then(() => {
        resolve(true);
      }).catch(reject);
    });
  }

  /* Delete a document on a specific path. */
  static removeDocumentByPath(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database.ref(path).remove().then(() => {
        resolve(true);
      }).catch(reject);
    });
  }
  /* Add a document to a list on a specific path. */
  static pushDocumentToPath(path: string, value: any): Promise<boolean> {
    const ref = database.ref(path).push();
    return DatabaseService.setDocumentByPath(`${path}/${ref.key}`, value);
  }

  /** Update many documents. */
  static updateDocuments(updates: { [path: string]: Object }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database.ref().update(updates).then(() => {
        resolve(true);
      }).catch(reject);
    });
  }

}
