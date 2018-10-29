// @flow
import * as Models from '../models/dataModels';
import { DatabaseService } from './database';
import { Utilities } from './utilities';
import { LocationService } from '../../services/location';

/** Defines options to be used for a barber search. */
export interface BarberSearchOptions {
  query?: string;
  distance?: number;
  sort?: 'price' | 'rating' | 'distance';
}

/** Find barbers for current user. */
export class BarberSearchService {

  static findBarbers(options?: BarberSearchOptions): Promise<Models.Barber[]> {
    return new Promise((resolve, reject) => {
      // Request search for API when ready
      const perform = (position) => {
        fetch(Utilities.API + '/findBarbers', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            position,
            filters: options
          })
        }).then(response => {
          if (response.ok) {
            response.json().then(resolve).catch(reject);
          } else {
            response.reject('Network error');
          }
        }).catch(reject);
      };

      // Get user location first
      LocationService.getUserPosition().then(perform).catch(() => { perform(); });
    });
  }

  static getBarberProfile(barberId: string): Promise<Models.Barber> {
    return new Promise((resolve, reject) => {
      DatabaseService.getDocumentByPath('barber/'+barberId).then(barber => {
        // Load barber reviews
        DatabaseService.getDocumentByPath('barberReview/'+barberId).then(reviewsObject => {
          // Convert to a list of reviews
          const reviews = (reviewsObject && Object.keys(reviewsObject).map(id => reviewsObject[id])) || [];

          // Sort list with earlier ones first
          reviews.reverse();

          // Add reviews to barber
          barber.reviews = reviews;
          resolve(barber);
        });
      }).catch(reject);
    });
  }

}
