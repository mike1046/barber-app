// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { ShopService } from '../../../services/shop';
import { MediaService } from '../../../../services/media';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { EditGalleryScreen } from '../../../../clypr-platform/screens/settings/EditGallery';

type State = {
  isLoading: boolean;
  media: Models.Media[];
};

type Props = {};

/** Manages shared logic for this screen. */
export class EditGalleryScreenContainer extends Component {

  state: State = { isLoading: false, media: [] };
  props: Props;
  _subscription;

  componentDidMount() {
    // Observer barber data
    this._subscription = ShopService.observeCurrentBarber(barber => {
      let media = (barber && barber.mediaGallery) || [];

      // Make a deep copy for editing
      media = media.map(s => Object.assign({}, s));
      
      this.setState({ media });
    });
  }

  componentWillUnmount() {
    if (this._subscription) { this._subscription.unsubscribe(); }
  }

  render() {
    // Get current media
    const media = this.state.media;

    return (
      <EditGalleryScreen
        isLoading={this.state.isLoading}
        media={media}
        onAddMedia={this.addMedia}
        onRemoveMedia={this.removeMedia} />
    );
  }

  addMedia = async () => {
    // Pick media
    const media = await MediaService.pickDeviceMedia();
    const image = media && media.base64
    if (media && media.success && image) {
      // Upload media
      this.setState({ isLoading: true });
      try {
        const url = await MediaService.getUploadedMediaUrl('media', image);
        if (url) {
          // Add media to gallery
          ShopService.editMedia(url, 'add').then(() => {
            // Success
            this.setState({ isLoading: false });
          }).catch(err => {
            Alert.show(err);
            this.setState({ isLoading: false });
          });
        } else {
          Alert.show('Error uploading your media');
          this.setState({ isLoading: false });
        }
      } catch (err) {
        Alert.show('Error uploading your media: ' + err.toString());
        this.setState({ isLoading: false });
      }
    }
  };

  removeMedia = (mediaUrl: string) => {
    // Remove media from gallery
    this.setState({ isLoading: true });
    
    ShopService.editMedia(mediaUrl, 'remove').then(() => {
      // Success
      this.setState({ isLoading: false });
    }).catch(err => {
      Alert.show(err);
      this.setState({ isLoading: false });
    });
  };

}
