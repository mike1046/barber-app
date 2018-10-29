// @flow
import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableHighlight } from 'react-native';
import { Button, Text } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import { Alert } from '../../../services/alert';
import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles, Variables } from '../../../styles/global';
import { Loading } from '../../components/Loading';

interface Props {
  isLoading: boolean;
  media: Models.Media[];
  onAddMedia: () => void;
  onRemoveMedia: (url: string) => void;
}

/** Implements this screen for Native platform. */
export class EditGalleryScreen extends Component {

  render() {
    if (this.props.isLoading) { return <Loading />; }

    const media = this.props.media;

    return (
      <ScrollView>
        <Button transparent block
                onPress={this.props.onAddMedia}
                style={style.addButton}>
          <Text style={Styles.primaryColor}>{Lang('settings_edit_gallery_addItem')}</Text>
        </Button>

        <View style={style.mediaGallery}>
          
          {media.map(aMedia => (
            <TouchableHighlight
              key={aMedia.url}
              style={style.photoContainer}
              onPress={() => this.removeMedia(aMedia.url) }>
              <Image source={{ uri: aMedia.url }} style={style.photo} />
            </TouchableHighlight>
          ))}

        </View>

        {media.length === 0 && (
          <Text style={Styles.title}>{Lang('settings_edit_gallery_empty')}</Text>
        )}
      </ScrollView>
    );
  }

  removeMedia = (url: string) => {
    // Confirm image removal
    Alert.confirm(
      Lang('settings_edit_gallery_delete_title'),
      Lang('settings_edit_gallery_delete_desc'),
      Lang('action_cancel'),
      Lang('action_delete'),
      null,
      () => this.props.onRemoveMedia(url)
    );
  }

}

const style = {

  addButton: {
    marginVertical: 20
  },

  mediaGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  photoContainer: {
    width: '45%',
    height: 170,
    marginRight: 5,
    marginBottom: 5
  },

  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: 'black'
  }

};
