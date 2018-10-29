// @flow
// $FlowIgnoreExpoBug
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import type {MediaServiceInterface} from '../clypr-shared/models/utils';
import {Utilities} from '../clypr-shared/services/utilities';
import {LocationService} from "./location";

export class MediaService implements MediaServiceInterface {

  static async pickDeviceMedia(): Promise<{ success: boolean; urlHeader?: string; base64?: string; }> {

    let status = await Permissions.check('photo');

    if (status !== 'authorized') {
      status = await Permissions.request('photo');
    }

    let result = {success: false};

    if (status === 'authorized') {
      // Get image from native device gallery

      result = new Promise((resolve, reject) => {
        ImagePicker.launchImageLibrary({
          allowsEditing: true,
          base64: true
        }, (image: { data?: ?string }) => {
          if (image && image.data) {
            // Return this image
            result = {
              success: true,
              urlHeader: 'data:image/jpg;base64,',
              base64: image.data
            };
            resolve(result)
          }
          else {
            reject()
          }
        });
      })

    }
    return result;
  }

  static async getUploadedMediaUrl(usage: 'avatar' | 'media', encodedImage: string, fileName?: string): Promise<string> {
    // Upload image
    const response = await fetch(Utilities.API + '/storeImage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usage,
        encodedImage,
        fileName,
        imageContentType: 'image/jpeg',
      })
    });

    // Extract url from response
    const data = await response.json();
    return data && data.url;
  }

}
