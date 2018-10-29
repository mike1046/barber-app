// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Text, Left, Right, Body, Thumbnail, Card, CardItem, View } from 'native-base';
const moment = require('moment');

import * as Models from '../../../../clypr-shared/models/dataModels';
import { Styles, Variables } from '../../../../styles/global';

import { BarberRating } from '../rating/BarberRating';

type Props = {
  entries: Models.BarberReview[];
  onSelect?: (review: Models.BarberReview) => void;
};

/** Render a list of reviews a barber has received. */
export class ReviewsList extends Component {

  props: Props;

  render() {
    return (
      <FlatList
        data={this.props.entries}
        keyExtractor={this._keyExtractor}
        renderItem={({item}) => this.renderItem(item)} />
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderItem(review: Models.BarberReview) {
    return (
      <Card>
        <CardItem
          button={this.props.onSelect ? true : false}
          onPress={() => this.select(review)} >

          <View>
            <BarberRating stars={review.stars || 0} size={20} />
            {review.text !== '' && <Text style={style.note}>{ review.text }</Text>}
            <Text style={style.date}>{ moment(review.createdAt).calendar() }</Text>
          </View>

        </CardItem>
      </Card>
    );
  }

  select = (payment: Models.Payment) => {
    if (this.props.onSelect) {
      this.props.onSelect(payment);
    }
  }

}

const style = {
  
  status: {},
  note: {
    fontSize: 16,
    marginTop: 5
  },

  date: {
    fontSize: 12,
    color: Variables.darkGrey,
    marginTop: 3
  }

};
