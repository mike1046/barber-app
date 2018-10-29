// @flow
import React, { Component } from 'react';
import { View, Icon } from 'native-base';
import { Variables } from '../../../styles/global';

type Props = {
  isFavorite: boolean;
};

/** Render a star if entity is preferred. */
export class FavoriteStatus extends Component {

  props: Props;

  render() {
    let colors = {...style.star};
    if (this.props.isFavorite) {
      colors = Object.assign({}, colors, style.favorite);
    }

    return (
      <Icon name="md-star"
            style={colors} />
    );
  }
}

const style = {

  star: {
    fontSize: 35,
    color: Variables.primaryLightColor
  },

  favorite: {
    color: Variables.primaryColor
  }

};
