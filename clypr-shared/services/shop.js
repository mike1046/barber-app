// @flow
import { AccountService } from './account';
import { DatabaseService } from './database';
import { Utilities } from './utilities';
import { NavigationService } from '../../services/navigator';
import type { Observable } from '../models/utils';
import * as Models from '../models/dataModels';
const moment = require('moment-timezone');

let _currentBarberInfo: ?Models.Barber;
let _barberInfoObserver: ?Observable;

type BarberObserver = (barber: ?Models.Barber) => void;
const _observers: { id: string, callback: BarberObserver }[] = [];

/** Represents available hours to make an appointment. */
export type AvailableHours = {
  [isoDate: string]: { // 'yyyy-mm-dd'
    value: string; // '9:00' or '16:00' 24 hour format
    label: string; // '09:00 AM' friendly format
  }[];
};

/** Represents dates with their hours already busy. */
export type BusyHours = {
  [isoDate: string]: Models.BarberSchedule
};

// Define default shop hours for barbers which have not set it
const _defaultShopHours: Models.ShopHours = {};
Utilities.weekDays.forEach(day => _defaultShopHours[day] = [{
  from: '9:00',
  to: '18:00',
  restricted: false
}]);

// Define formats to be reusable on database
const _formats = {
  shopHoursOnDatabase: 'HH:mm',
  shopHoursOnScreen: 'hh:mm A'
};

/** Manage barber and client appointments. */
export class ShopService {

  /** Listen for login state and load barber data. */
  static initialize() {
    // Listen for login state
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      if (isLoggedIn && user && user.id && user.role === 'barber') {
        // User is logged in and is a barber
        const barberId = user.id;

        // Observe barber information
        if (barberId && (
            !_barberInfoObserver ||
            !_currentBarberInfo ||
            (_currentBarberInfo.id !== barberId))) {
          // Barber id has changed. Create a new observer.
          if (_barberInfoObserver) {
            // Unsubscribe previous observer
            _barberInfoObserver.unsubscribe();
          }

          _barberInfoObserver = DatabaseService.observeDocumentByPath('barber/'+barberId, (barber: ?Models.Barber) => {
            _currentBarberInfo = barber;
            ShopService._notifyChanges();

            // Barber logged in, check if he has all required information
            ShopService.checkRequiredShopInfo();
          });
        }
      } else {
        // User is logged out or is not a barber
        _currentBarberInfo = null;
        ShopService._notifyChanges();
      }
    });
  }

  /** Redirects a barber to fill shop information. */
  static checkRequiredShopInfo() {
    const barber = _currentBarberInfo;
    const services = barber && barber.services;
    const address = barber && barber.shop && barber.shop.address;
    const hours = barber && barber.shop && barber.shop.hours;

    // Fill shop address if needed. Wait half a second, until other app components finish navigating.
    setTimeout(() => {
      if (!address) {
        NavigationService.goTo('/settings/address');
      } else if (!hours) {
        NavigationService.goTo('/settings/schedule');
      } else if (!services || services.length === 0) {
        NavigationService.goTo('/settings/services');
      }
    }, 1000);
  }

  /** Update current barber's info. */
  static updateField(fieldPath: string, data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Get current user
      const user = AccountService.getCurrentUser();
      if (user && user.id && user.role === 'barber') {
        // Update field on barber profile
        const barberId = user.id;
        DatabaseService.setDocumentByPath(`barber/${barberId}/${fieldPath}`, data).then(resolve).catch(reject);
      } else {
        reject('Please login first');
      }
    });
  }

  /** Update current barber's shop address. */
  static updateAddress(address: Models.EncodedAddress): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (address &&
          address.shopName &&
          address.street &&
          address.city &&
          address.state) {
        // Update field
        ShopService.updateField('shop/address', address).then(resolve).catch(reject);

        // Barber updated information, check if he has all required information
        ShopService.checkRequiredShopInfo();

        // Find a geolocation to this address
        const addr = `${address.street}, ${address.street2}. ${address.city}, ${address.state}. ${address.zipcode}`;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=AIzaSyCH3SCnSbxekCb9dANikGqGIR4wHnXsQ50`).then(response => {
          if (response.ok) {
            response.json().then(data => {
              // Extract geolocation from results
              if (data.results) {
                const res = data.results[0];
                if (res.geometry && res.geometry.location) {
                  const position = res.geometry.location;
                  if (position.lat && position.lng) {
                    // Associate this position with current barber
                    ShopService.updateField('shop/position', position);
                  }
                }
              }
            });
          }
        });
      } else {
        reject('Missing data');
      }
    });
  }

  /** Update shop hours for current barber. */
  static updateHours(hours: Models.ShopHours): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (hours) {
        // Update field
        ShopService.updateField('shop/hours', hours).then(resolve).catch(reject);

        // Barber updated information, check if he has all required information
        ShopService.checkRequiredShopInfo();
      } else {
        reject('Missing data');
      }
    });
  }

  /** Update a specific service in a list for current barber. */
  static updateService(service: Models.BarberService, operation: 'edit' | 'remove'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (service) {
        // Get current user
        const user = AccountService.getCurrentUser();
        if (user && user.id && user.role === 'barber') {
          // Get user services list
          const barber = ShopService.getCurrentBarber();
          const services: Models.BarberService[] = (barber && barber.services) || [];

          // Find service on current list
          const oldService = service.id && services.find(serv => serv.id === service.id);
        
          if (oldService) {
            if (operation === 'edit') {
              // Update existing service
              Object.assign(oldService, service);
            } else if (operation === 'remove') {
              // Remove existing service
              const oldServiceIndex = services.findIndex(serv => serv.id === service.id);
              if (oldServiceIndex > -1) { services.splice(oldServiceIndex, 1); }
            }
          } else {
            // Add new service with a new random id
            service.id = Math.random().toString().substr(2);
            services.push(service);
          }

          // Save services list
          ShopService.updateField('services', services).then(resolve).catch(reject);

          // Update the average the price for this barber
          let pricesSum = 0;
          let servicesCount = 0;
          services.forEach(serv => {
            if (serv.price) {
              pricesSum += serv.price;
              servicesCount++;
            }
          });

          let averagePrice = 0;
          if (servicesCount > 0) { averagePrice = Math.round(pricesSum/servicesCount); }
          ShopService.updateField('averagePrice', averagePrice);
        } else {
          reject('Please login first');
        }
      } else {
        reject('Missing data');
      }
    });
  }

  /** Edits a media in current gallery. */
  static editMedia(url: string, operation: 'add' | 'remove'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (url && operation) {
        // Get current user
        const user = AccountService.getCurrentUser();
        if (user && user.id && user.role === 'barber') {
          // Get gallery
          const barber = ShopService.getCurrentBarber();
          const gallery = (barber && barber.mediaGallery) || [];

          if (operation === 'add') {
            // Add media to gallery
            gallery.push({ type: 'photo', url });
          } else if (operation === 'remove') {
            // Remove media from gallery
            const index = gallery.findIndex(m => m.url === url);
            if (index > -1) { gallery.splice(index, 1); }
          }

          // Save updated gallery
          ShopService.updateField('mediaGallery', gallery).then(resolve).catch(reject);

          // Barber updated information, check if he has all required information
          ShopService.checkRequiredShopInfo();
        } else {
          reject('Please login first');
        }
      } else {
        reject('Missing data');
      }
    });
  }

  /** Get current barber's data. */
  static getCurrentBarber(): ?Models.Barber {
    return _currentBarberInfo;
  }

  /** Observe for changes on barber data. Returns unsubscribe method. */
  static observeCurrentBarber(callback: BarberObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.push({ id, callback });

    // Send first data
    callback(_currentBarberInfo);

    // Return subscription
    return { unsubscribe: () => ShopService._unsubscribeObserver(id) };
  }

  static _unsubscribeObserver(subscriptionId: string) {
    const index = _observers.findIndex(o => o.id === subscriptionId);
    if (index > -1) { _observers.splice(index, 1); }
  }

  static _notifyChanges() {
    _observers.forEach(obs => { obs.callback(_currentBarberInfo); });
  }

  /** Get available hours for new appointment for a specific barber. */
  static getAvailableHours(barberId: string): Promise<AvailableHours> {
    return new Promise((resolve, reject) => {
      // Show up to 15 days from now
      const nextDays = Utilities.getDatesAroundToday(0, 15);

      // Get default barber shop hours
      DatabaseService.getDocumentByPath('barber/'+barberId).then((barber: Models.Barber) => {
        if (barber) {
          // Parse current time on barber shop
          const barberTimezone = (barber && barber.shop && barber.shop.address && barber.shop.address.timezone) || 'US/Eastern';
          const barberNow = moment().tz(barberTimezone);

          // Only enable scheduling with at least 30 minutes ahead
          barberNow.add(30, 'minutes');

          // Get configured shop hours
          const shopHours = (barber.shop && barber.shop.hours) || _defaultShopHours;

          // Get busy shop hours from barber schedule
          const loadBusyHours = (): Promise<BusyHours> => {
            return new Promise((resolve, reject) => {
              // Load information for each date
              const tasks = nextDays.map(aDate => {
                // Return promise that will load information for that day
                const path = 'barberSchedule/'+barberId+'/'+aDate.date.replace(/-/g, '/');
                return DatabaseService.getDocumentByPath(path);
              });

              // Execute all tasks
              Promise.all(tasks).then((busyHours: Models.BarberSchedule[]) => {
                // Associate each day hours with a date
                const finalBusyHours = {};
                nextDays.forEach((aDate, index) => {
                  finalBusyHours[aDate.date] = busyHours[index];
                });

                // Return complete busy hours
                resolve(finalBusyHours);
              });
            });
          };

          // Get shop hours for a specific week day
          const getHoursForWeekDay = (weekday: Models.WeekDays,
                                      onDate?: string,
                                      busyHours?: BusyHours,
                                      isFavorite?: boolean) => {
            // Get hours for this weekday
            const hours = shopHours[weekday];

            if (hours && hours.length > 0) {
              // Make a list of time intervals
              const availableHours = [];

              // Parse each interval of hours on this day
              hours.forEach(time => {
                // Skip this hour interval if user is not a preferred client
                if (time.restricted && !isFavorite) { return; }

                // Parse hour
                let lastTime = moment(time.from, _formats.shopHoursOnDatabase);
                const endTime = moment(time.to, _formats.shopHoursOnDatabase);

                while(lastTime < endTime) {
                  // Build an entry for this hour
                  const targetHour = lastTime.format(_formats.shopHoursOnDatabase);
                  const entry = {
                    value: lastTime.format(_formats.shopHoursOnDatabase),
                    label: lastTime.format(_formats.shopHoursOnScreen)
                  };

                  // Check if hour is busy on this date
                  const isHourBusy = onDate &&
                                    busyHours &&
                                    busyHours[onDate] &&
                                    busyHours[onDate][targetHour];
                  
                  // Show hour as available if there is not a scheduled for it already
                  let isHourVisible = !isHourBusy;

                  // Hide hour if it is past barber local time
                  if (onDate) {
                    // Parse date and time according to barber's timezone
                    const dateToCheck = `${onDate}T${targetHour}`;
                    const targetDateAndTime = moment.tz(dateToCheck, barberTimezone);
                    
                    // Check if date and time is past according to barber's timezone
                    if (targetDateAndTime <= barberNow) { isHourVisible = false; }
                  }

                  if (isHourVisible) {
                    // Hour is not busy or there is not busy hours information.
                    // Add hour to available list.
                    availableHours.push(entry);
                  }

                  lastTime = lastTime.clone().add(30, 'minutes');
                }
              });

              return availableHours;
            } else {
              // Shop is closed on this weekday
              return [];
            }
          };

          // Load busy hours
          loadBusyHours().then(busyHours => {
            // Check if current user is a preferred client for this barber
            AccountService.isPreferredUserFor(barberId).then(isFavorite => {
              // Use shop hours for all next days
              const availability: AvailableHours = {};
              nextDays.forEach(day => {
                availability[day.date] = getHoursForWeekDay(day.weekday, day.date, busyHours, isFavorite);
              });

              resolve(availability);
            }).catch(reject);
          }).catch(reject);
        } else {
          reject('Barber not found');
        }
      }).catch(reject);
    });
  }
}

// Connect to Account Service and track login state
ShopService.initialize();
