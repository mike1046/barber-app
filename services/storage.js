// @flow
import { AsyncStorage } from 'react-native';
import type { StorageServiceInterface } from '../clypr-shared/models/utils';

/** Persist data to storage on native version. */
export class StorageService implements StorageServiceInterface {

  static async read(key: string) {
    const data = await AsyncStorage.getItem(key);
    return data && JSON.parse(data);
  }

  static async save(key: string, data: any) {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  }

  static async reset() {
    await AsyncStorage.clear();
    return true;
  }

}
