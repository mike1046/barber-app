// @flow
import React, { Component } from 'react';
import { FlatList, Image, View } from 'react-native';
import { Text, Left, Right, Body, Thumbnail, Card, CardItem } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles } from '../../../styles/global';

type Props = {
  entries: Models.Payment[];
  onSelect?: (payment: Models.Payment) => void;
  itemStyle?: Object;
};

/** Render a list of payments a user has made. */
export class PaymentsList extends Component {

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

  renderItem(payment: Models.Payment) {
    return (
      <Card>
        <CardItem
          button={this.props.onSelect ? true : false}
          onPress={() => this.select(payment)}
          style={this.props.itemStyle || {}} >

          {payment.paymentSource && <View style={{marginRight: 15, alignItems: 'center'}}>
            <Image style={style.paymentMethodIcon} source={payment.paymentSource.brandImage} />
            <Text style={style.last4}>{payment.paymentSource.last4}</Text>
          </View>}

          <Body style={style.body}>
            <Text style={style.status}>{Lang('payment_status_title')} { payment.status }</Text>
            {payment.details && payment.details.note && <Text style={style.note}>{ payment.details.note }</Text>}
            <Text style={style.date}>{ moment(payment.createdAt).calendar() }</Text>
          </Body>

          <Right style={Styles.listItemSides}>
            <Text style={style.amount}>${payment.amount}</Text>
          </Right>

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
  
  amount: {
    fontSize: 20
  },

  body: {},

  status: {},
  note: {
    fontSize: 14,
    marginTop: 10
  },

  date: {
    fontSize: 14,
    marginTop: 3
  },

  paymentMethodIcon: {
    height: 26,
    width: 42,
    resizeMode: 'contain'
  },

  last4: {
    fontSize: 14
  }
};
