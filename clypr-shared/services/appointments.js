// @flow
import { AccountService } from './account';
import { DatabaseService } from './database';
import { PaymentsService } from './payments';
import * as Models from '../models/dataModels';
import type { Observable } from '../models/utils';
import { Utilities } from './utilities';
const moment = require('moment-timezone');

/** Defines options to use when creating an appointment. */
export interface AppointmentOptions {
  barberId: string;
  date: {
    year: number; // yyyy
    month: number; // m
    day: number; // d
    hour: number; // HH 24 hour format
    minute: number; // mm
  };
  urgent: boolean;
  serviceIds: string[];
}

/** Defines the cost for an appointment, based on chosen services and fees. */
export type ReservationCost = {
  subTotal: number;
  fees: { label: string, amount: number }[];
  total: number;
};

type AppointmentsObserver = (appts: Models.Appointment[]) => void;
type ReminderObserver = (appt: ?Models.Appointment) => void;
type ClientsObserver = (clients: Models.BarberClient[]) => void;
type Observers = {
  appointments: { id: string, callback: AppointmentsObserver }[];
  reminder: { id: string, callback: ReminderObserver }[];
  clients: { id: string, callback: ClientsObserver }[];
};
type ObservableData = {
  appointments: Models.Appointment[];
  clients: Models.BarberClient[];
  reminder: ?Models.Appointment;
};

const _observers: Observers = {
  appointments: [],
  reminder: [],
  clients: []
};

const _data: ObservableData = {
  appointments: [],
  clients: [],
  reminder: null
};

let _remoteSettings = null;

/** Manage barber and client appointments. */
export class AppointmentsService {

  static initialize() {
    // Monitor data
    AppointmentsService._trackAllAppointments();
    AppointmentsService._trackAllClients();
    AppointmentsService._trackReminder();

    // Load remote settings
    DatabaseService.getDocumentByPath('settings/appointments').then(val => _remoteSettings = val);
  }

  /** Listen for all appointments for current user. */
  static _trackAllAppointments() {
    // Get current user
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      if (isLoggedIn) {
        // Get all complete appointments for this user
        if (user && user.appointments && user.appointments.length > 0) {
          // Process appointments
          const result = [];
          let tasks = user.appointments.length;

          const sort = () => {
            // Sort appointments by UTC date, future dates and earlier hours coming first
            _data.appointments.sort((a, b) => (a._dateUTC || 0) > (b._dateUTC || 0) ? 1 : -1);
          };

          const maybeFinish = () => {
            tasks--;
            if (tasks <= 0) {
              // Save current appointments
              _data.appointments = result;
              sort();

              // Sync payment data to appointments
              AppointmentsService._syncPaymentInfo();

              // Notify changes
              AppointmentsService._notify('appointments');
            }
          };

          // Get each full appointment
          user.appointments.forEach(indexedAppointment => {
            if (indexedAppointment.id) {
              // Observe future changes for this appointment
              let doc: Models.Appointment;
              
              DatabaseService.observeDocumentByPath('appointment/'+indexedAppointment.id, (originalDoc: Models.Appointment) => {
                // Load review data when ready
                const preloadReviewData = () => new Promise((resolve, reject) => {
                  if (originalDoc.reviewId) {
                    // Only preload review the first time
                    if (!originalDoc.review && (!doc || !doc.review)) {
                      DatabaseService.getDocumentByPath(`barberReview/${originalDoc.barberId}/${originalDoc.reviewId}`).then((review: Models.BarberReview) => {
                        // Add review data
                        originalDoc.review = review;
                        if (doc) { doc.review = review; }
                        resolve();
                      }).catch(resolve);
                    } else { resolve(); }
                  } else { resolve(); }
                });

                if (!doc) {
                  // Add appointment to list
                  doc = originalDoc;
                  
                  if (doc) {
                    // Prepare to add profile info when available
                    const addProfileInfo = (type: Models.UserRole, profile: any) => {
                      if (type && profile) {
                        doc[type] = profile;
                      }

                      // Add review data, if any
                      preloadReviewData().then(() => {
                        // Use appointment
                        result.push(doc);
                        maybeFinish();
                      });
                    };

                    // Fetch barber's profile
                    const barberId = doc.barberId;
                    DatabaseService.getDocumentByPath('barber/'+barberId).then((barber: Models.Barber) => {
                      // Add services details
                      if (barber && doc.requestedServicesIds && barber.services) {
                        doc.services = [];
                        doc.requestedServicesIds.forEach(serv => {
                          // Add service info if available
                          const serviceInfo = barber.services.find(s => s.id === serv);
                          if (doc.services && serviceInfo) { doc.services.push(serviceInfo); }
                        });
                      }

                      // Add UTC date to help on sorting, based on shop's timezone
                      const barberTimezone = (barber && barber.shop && barber.shop.address && barber.shop.address.timezone) || 'US/Eastern';
                      doc._dateUTC = moment.tz(doc.date, barberTimezone).unix();

                      // Get profile info for involved user
                      if (user && user.role === 'barber') {
                        // Fetch client's profile
                        const uid = doc.clientId;
                        DatabaseService.getDocumentByPath('user/'+uid+'/profile').then((profile: Models.UserProfile) => {
                          addProfileInfo('client', { profile });
                        }).catch(maybeFinish);
                      } else { addProfileInfo('barber', barber); }
                    }).catch(maybeFinish);
                  } else { maybeFinish(); }
                } else {
                  // Appointment was updated after being added to list.
                  // Maybe it needs to preload review data
                  preloadReviewData().then(() => {
                    Object.assign(doc, originalDoc);

                    // Notify changes
                    sort();
                    AppointmentsService._notify('appointments');
                  });
                }
              });
            }
          });
        } else {
          // User has no appointments yet
          _data.appointments = [];
          AppointmentsService._notify('appointments');
        }
      } else {
        // User is logged out
        _data.appointments = [];
        AppointmentsService._notify('appointments');
      }
    });
  }

  /** Listen for all payments and sync that information into appointments. */
  static _syncPaymentInfo() {
    // Observe all payments
    PaymentsService.observeAllPayments(payments => {
      // Update received. Add payment info for every appointment
      payments.forEach(payment => {
        const id = payment && payment.details && payment.details.appointmentId;
        if (id && _data.appointments) {
          // Find appointment
          const appt = _data.appointments.find(apt => apt.id === id);
          if (appt) {
            // Check if it already has this payment listed
            let index = -1;
            if (appt.payments) { index = appt.payments.findIndex(pay => pay.id === payment.id); }

            if (index >= 0 && appt.payments) {
              // Update existing data
              appt.payments[index] = payment;
            } else {
              // Add payment to current list
              if (!appt.payments) { appt.payments = []; }
              appt.payments.unshift(payment);
            }

            // Sort payments, earlier first
            if (appt.payments && appt.payments.length > 1) {
              appt.payments.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1);
            }
          }
        }
      });

      // Notify changes
      AppointmentsService._notify('appointments');
    });
  }

  /** Listen for all clients current user has, if he is a barber. */
  static _trackAllClients() {
    // Get current user
    AccountService.observeCurrentUser((isLoggedIn, user) => {
      // Only proceed if current user is a barber
      if (user && user.role === 'barber') {
        // Get all appointments for this barber
        const appointments = user.appointments || [];

        // Build a list of clients with their profiles
        const clients: Models.BarberClient[] = [];

        let tasks = appointments.length;
        const maybeFinish = () => {
          tasks--;
          if (tasks <= 0) {
            // Store All client profiles fetched.
            _data.clients = clients;
            AppointmentsService._notify('clients');
          }
        }

        // Get full profile for each client
        const processedClients = new Set();
        appointments.forEach(appt => {
          const clientId = appt.clientId;

          if (clientId) {
            if (!processedClients.has(clientId)) {
              // Check if this client is favorite
              const isFavorite = (user && user.favoriteIds && user.favoriteIds[clientId]) || false;

              // Fetch client profile
              processedClients.add(clientId);
              DatabaseService.observeDocumentByPath('user/'+clientId+'/profile', (profile: Models.UserProfile) => {
                // Build a barber client information for this user
                const aClient: Models.BarberClient = {
                  ...profile,
                  id: clientId,
                  isFavorite
                };

                clients.push(aClient);
                maybeFinish();
              });
            } else {
              // Client was already processed
              maybeFinish();
            }
          } else {
            // Appointment has not client information. Skip it.
            maybeFinish();
          }
        });
      } else {
        // User is not a barber
        _data.clients = [];
        AppointmentsService._notify('clients');
      }
    });
  }

  /** Find an adequate reminder to current user. */
  static _trackReminder() {
    // Observe all appointments
    AppointmentsService.observeAllAppointments(appts => {
      if (appts && appts.length > 0) {
        // Get next future appointment
        const now = moment().unix();
        let appt = appts.find(ap => (ap._dateUTC || 0) > now && ap.status === 'scheduled');

        if (!appt) {
          // Find most recent past appointment, keeping older items first
          const reversed = appts.map(i => i).reverse();
          appt = reversed.find(ap => (ap._dateUTC || 0) <= now && ap.status !== 'cancelled');
        }

        // Use appointment as reminder
        _data.reminder = appt;
        AppointmentsService._notify('reminder');
      } else {
        // User has not appointments
        _data.reminder = null;
        AppointmentsService._notify('reminder');
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


  /** Observe all appointments for current user. */
  static observeAllAppointments(callback: AppointmentsObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.appointments.push({ id, callback });

    // Send first data
    callback(_data.appointments);

    // Return unsubscribe method
    return { unsubscribe: () => { AppointmentsService._unsubscribe('appointments', id); }};
  }

  /** Return all clients which made appointments with logged in barber. */
  static observeAllClients(callback: ClientsObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.clients.push({ id, callback });

    // Send first data
    callback(_data.clients);

    // Return unsubscribe method
    return { unsubscribe: () => { AppointmentsService._unsubscribe('clients', id); }};
  }

  /** Observe an appointment to remind the user, if any. */
  static observeReminderAppointment(callback: ReminderObserver): Observable {
    // Create an id for this observer
    const id = Math.random().toString().substr(2);
    _observers.reminder.push({ id, callback });

    // Send first data
    callback(_data.reminder);

    // Return unsubscribe method
    return { unsubscribe: () => { AppointmentsService._unsubscribe('reminder', id); }};
  }


  static create(options: AppointmentOptions, predictedAmount: number): Promise<Models.Appointment> {
    return new Promise((resolve, reject) => {
      // Check if user is logged in
      if (AccountService.isLoggedIn()) {
        // Get current user
        const user = AccountService.getCurrentUser();

        // Check if options are valid
        if (user &&
            options &&
            options.barberId &&
            options.date &&
            options.urgent !== undefined) {
          // Get firebase login token for current user
          AccountService.getFirebaseToken().then(token => {
            // Request appointment creation to API
            fetch(Utilities.API + '/createAppointment', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
              },
              body: JSON.stringify({ options, predictedAmount })
            }).then(response => {
              if (response.ok) {
                response.json().then(resolve).catch(reject);
              } else {
                // Get error message
                response.text().then(err => reject('Error: '+err));
              }
            }).catch(reject);
          }).catch(reject);
        } else {
          // Invalid data
          reject('Missing data');
        }
      } else {
        // User is logged out
        reject('Please login first');
      }
    });
  }

  static getAppointment(id: string): Promise<?Models.Appointment> {
    // Get appointment info from current loaded data only
    const appt = _data.appointments.find(entry => entry.id === id);
    return Promise.resolve(appt);
  }

  /** Perform an action in an appointment. */
  static manage(appointmentId: string, action: 'cancel' | 'reschedule' | 'complete' | 'noshow' | 'start', options?: Object): Promise<{
    success: boolean;
    info?: { amountToCharge: number }
  }> {
    return new Promise((resolve, reject) => {
      // Get firebase login token for current user
      AccountService.getFirebaseToken().then(token => {
        
        // Request action to API
        fetch(Utilities.API + '/manageAppointment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
          },
          body: JSON.stringify({
            appointmentId,
            action,
            options
          })
        }).then(response => {
          if (response.ok) {
            response.json().then(info => {
              resolve({ success: true, info });
            });
          } else {
            // Get error message
            response.text().then(err => reject('Error: '+err));
          }
        }).catch(reject);
      }).catch(reject);
    });
  }

  /** Create a barber's review based on an appointment. */
  static createReview(appointmentId: string, ratings: Models.BarberReviewRatings, text: string, tip: number = 0): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Check if user is logged in
      if (AccountService.isLoggedIn()) {
        // Get current user
        const user = AccountService.getCurrentUser();

        // Check if options are valid
        if (user &&
            ratings &&
            ratings.haircutQuality &&
            ratings.customerServiceQuality &&
            ratings.barberPunctuality) {
          // Get firebase login token for current user
          AccountService.getFirebaseToken().then(token => {
            // Request appointment creation to API
            fetch(Utilities.API + '/createBarberReview', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
              },
              body: JSON.stringify({
                appointmentId,
                ratings,
                text,
                tip
              })
            }).then(response => {
              if (response.ok) {
                resolve(true);
              } else {
                // Get error message
                response.text().then(err => reject('Error: '+err));
              }
            }).catch(reject);
          }).catch(reject);
        } else {
          // Invalid data
          reject('Missing data');
        }
      } else {
        // User is logged out
        reject('Please login first');
      }
    });
  }

  /** Calculate amount for a reservation. */
  static calculateReservationAmount(services: Models.BarberService[], extraFees?: { label: string, amount: number }[]): ReservationCost {
    let subTotal = 0;
    let total = 0;
    const fees = [];

    // Add all services cost
    services.forEach(service => {
      if (service.price) {
        subTotal += service.price;
        total += service.price;
      }
    });

    // Add extra fixed costs
    if (_remoteSettings && _remoteSettings.usdAmountAddedToReservation) {
      total += _remoteSettings.usdAmountAddedToReservation;
      fees.push({ label: 'Clypr', amount: _remoteSettings.usdAmountAddedToReservation });
    }

    // Add custom extra fees
    if (extraFees) {
      extraFees.forEach(fee => {
        total += fee.amount;
        fees.push(fee);
      });
    }

    return { subTotal, fees, total };
  }

}

// Initialize data monitoring
AppointmentsService.initialize();
