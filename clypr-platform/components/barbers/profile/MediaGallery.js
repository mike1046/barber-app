// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ImageSlider from 'react-native-image-slider';

import * as Models from '../../../../clypr-shared/models/dataModels';
import Lang from '../../../../clypr-shared/services/lang';
import { NavigationService } from '../../../../services/navigator';

type Props = {
  media: ?Models.Media[];
  disableTaps?: boolean;
};

/** Render an image gallery from a barber. */
export class MediaGallery extends Component {

  props: Props;

  render() {
    const media = this.props.media;
    const urls = media && media.map(m => m.url);

    return media && media.length > 0 ? (
      <ImageSlider
        images={urls}
        height="100%"
        onPress={m => this.openMedia(m.image)} />
    ) : (
      <View>
        <Text style={style.empty}>{Lang('mediaGallery_empty')}</Text>
      </View>
    );
  }

  openMedia = (url: string) => {
    if (!this.props.disableTaps) {
      NavigationService.goTo('/media', { url });
    }
  };
}

const style = {

  empty: {
    fontSize: 16,
    textAlign: 'center'
  }

};
