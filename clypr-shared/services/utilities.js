// @flow
import {Firebase} from '../../styles/global'
import * as Models from '../models/dataModels';
const moment = require('moment');

interface DateInfo {
  date: string, // Date as yyyy-mm-dd
  weekday: Models.WeekDays, // Day of week as 'mon', 'tue'...
  isToday: boolean // Mark if date is today
};

/** Provides several reusable functions. */
export class Utilities {

  // Days of the week
  static weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // API address
  static API = Firebase.apiUrl;

  /** Transforms an object with address info into a friendly string. */
  static getParsedAddress(address: Models.EncodedAddress): string {
    let res = [];

    if (address.street) { res.push(address.street); }
    if (address.street2) { res.push(address.street2); }
    if (address.city) { res.push(address.city); }

    if (!address.street &&
        !address.street2 &&
        address.state) { res.push(address.state); }

    return res.join(', ');
  }

  /** Removes a parameter from a url. */
  static removeParameterFromUrl(url: string, parameter: string): string {
    return url
      .replace(new RegExp('[?&]' + parameter + '=[^&#]*(#.*)?$'), '$1')
      .replace(new RegExp('([?&])' + parameter + '=[^&]*&'), '$1');
  }

  /** Generate a list of days in relation to today. */
  static getDatesAroundToday(amountOfPastDays = 0, amountOfFutureDays = 3): DateInfo[] {
    // Set initial and end dates
    const rangeStart = amountOfPastDays > 0 ? moment().subtract(amountOfPastDays, 'days') : moment();
    const rangeEnd = moment().add(amountOfFutureDays, 'days');
    const today = moment().format('YYYY-MM-DD');

    // Set a list of dates
    const nextDays: DateInfo[] = [];

    // Generate information for the next few days
    let lastDate = rangeStart;
    while (lastDate <= rangeEnd) {
      const date = lastDate.format('YYYY-MM-DD');
      const weekday = Utilities.weekDays[lastDate.day()];

      nextDays.push({
        date,
        weekday,
        isToday: date === today
      });

      lastDate = lastDate.clone().add(1, 'days');
    }

    return nextDays;
  }

}
