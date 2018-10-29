// @flow
import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableHighlight, Linking } from 'react-native';
import { Variables } from '../../../../styles/global';

import * as Models from '../../../../clypr-shared/models/dataModels';
import { Utilities } from '../../../../clypr-shared/services/utilities';

type Props = {
  address?: Models.EncodedAddress;
};

/** Render a map with an address. */
export class AddressWithMap extends Component {

  props: Props;
  googleMapsUrl = 'https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=300x200&key=AIzaSyAPBYhea7jfHIJmJ1FY1HEtgEwEhembccY';

  render() {
    // Get a friendly address
    const address = Utilities.getParsedAddress(this.props.address);
    const imageURL = `${this.googleMapsUrl}&center=${address}&markers=color:0x25aae1|${address}`;
    
    return (
      <TouchableHighlight style={style.button} onPress={this.openMap}>
        <ImageBackground
          source={{ uri: imageURL }}
          style={style.map}>
          
          <View style={style.text}>
            {this.props.address && this.props.address.shopName && <Text style={style.title}>{this.props.address.shopName}</Text>}
            {this.props.address && <Text style={style.address}>{address}</Text>}
          </View>
        </ImageBackground>
      </TouchableHighlight>
    );
  }

  openMap = () => {
    const address = this.props.address;
    const directions = address && Utilities.getParsedAddress(address);
    
    if (directions) {
      const url = 'https://maps.google.com/?q=' + encodeURIComponent(directions);
      Linking.openURL(url);
    }
  };
}

const mapHeight = 120;
const style = {

  button: {
    width:'100%',
    height: mapHeight
  },

  map: {
    width: '100%',
    height: mapHeight,
    paddingHorizontal: 10,
    borderRadius: 10
  },

  text: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 7
  },

  title: {
    textAlign: 'center',
    fontSize: 18
  },

  address: {
    textAlign: 'center'
  },

};
