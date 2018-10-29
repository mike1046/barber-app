// @flow
import en from '../locales/en';

/** Get localized strings. */
export default function Lang(id: string): string {
  return en[id];
}
