// @flow
import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import * as Models from '../../../../clypr-shared/models/dataModels';
import { BarberRating } from '../rating/BarberRating';

type Props = {
  barber: Models.Barber;
  hideRating?: boolean;
};

/** Render a barber's avatar with image, name and rating. */
export class BarberAvatar extends Component {

  props: Props;

  render() {
    const barber = this.props.barber;

    return (
      <View style={style.avatar}>
        <Image
          style={style.avatarImage}
          source={
            barber.profile && barber.profile.avatarUrl ?
              { uri: barber.profile.avatarUrl } : require('../../../../assets/avatar.png')} />
        
        <View>
          <Text style={style.avatarName}>{barber.profile && barber.profile.name}</Text>
          
          {!this.props.hideRating &&
            barber.rating !== null &&
            <BarberRating stars={barber.rating} size={20} />}
        </View>
      </View>
    )
  }
}

const style = {

  avatar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatarName: {
    fontSize: 20,
    marginBottom: 3
  },

  avatarImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    borderRadius: 35,
    marginRight: 15
  },

};
