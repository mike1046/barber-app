// @flow
import Permissions from 'react-native-permissions';

let _currentPosition: { lat: number, lng: number };

/** Gets user location information for current platform. */
export class LocationService {

  static _maxAge = 20 * 60 * 1000; // 20 minutes
  static getUserPosition = async () => {
    const status = await Permissions.request('location');

    if (status !== 'authorized') { return null; }
    
    // Fetch location
    const location =  new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => resolve(pos), error => reject(error), {
        enableHighAccuracy: false,
        maximumAge: LocationService._maxAge
      })
    })

    if (location && location.coords && location.coords.latitude && location.coords.longitude) {
      _currentPosition = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };

      return _currentPosition;
    } else { return null; }
  }
}
