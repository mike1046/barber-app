// @flow
import React, { Component } from 'react';
import { View, Icon, Text } from 'native-base';
import { Variables } from '../../../../styles/global';

type Props = {
  stars: ?number;
  size?: number;
};

/** Render a rating with stars. */
export class BarberRating extends Component {

  props: Props;

  render() {
    const amount = this.props.stars || 0;
    let stars = 1;
    let elements = [];

    while (stars <= 5) {
      let styling = stars > amount ? style.off : style.on;
      if (this.props.size) {
        // Add given size for icons
        styling = { fontSize: this.props.size, ...styling };
      }
      
      elements.push(<Icon key={stars}
                          name="md-star"
                          style={{...style.star, ...styling}} />);
      stars++;
    }

    return (
      <View style={style.rating}>
        {elements.map(s => s)}
      </View>
    );
  }
}

const style = {

  rating: {
    flexDirection: 'row'
  },

  star: {
    fontSize: 16,
    marginLeft: 1
  },

  on: {
    color: Variables.primaryColor
  },

  off: {
    color: Variables.disabledGrey
  }

};
