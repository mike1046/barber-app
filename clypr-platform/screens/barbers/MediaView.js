// @flow
import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';

type Props = {
  url: string
};

/** View a media on full screen. */
export class MediaView extends PureComponent {

  props: Props;

  render() {
    return (
      <View style={style.container}>
        <Image source={{ uri: this.props.url }} style={style.image} />
      </View>
    );
  }
}

const style = {

  container: {
    flex: 1
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  }

};
