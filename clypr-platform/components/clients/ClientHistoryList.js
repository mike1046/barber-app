// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Text, Left, Right, Body, Thumbnail, Card, CardItem } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles } from '../../../styles/global';

type Props = {
  entries: Models.Appointment[];
  onSelect: (appt: Models.Appointment) => void;
};

/** Render a list of past and future appointments with a client. */
export class ClientHistoryList extends Component {

  props: Props;

  render() {
    return (
      <FlatList
        data={this.props.entries}
        keyExtractor={this._keyExtractor}
        renderItem={({item}) => this.renderAppointment(item)}
        style={Styles.section} />
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderAppointment(entry: Models.Appointment) {
    // Parse date
    const date = moment(entry.date);
    const service = entry && entry.services && entry.services[0];

    return (
      <Card>
        <CardItem button onPress={() => { this.props.onSelect(entry); }}>

          <Left style={style.date}>
            <Text style={style.dateWeekday}>{ date.format('ddd') }</Text>
            <Text style={style.dateDay}>{ date.format('D') }</Text>
            <Text style={style.dateMonth}>{ date.format('MMM') }</Text>
          </Left>

          <Body style={Styles.listItemBody}>
            {service && <Text>{service.label}</Text>}
          </Body>

          <Right>
            {service && <Text>${service.price}</Text>}
          </Right>

        </CardItem>
      </Card>
    );
  }

}

const style = {

  date: {
    flexDirection: 'column',
    flex: 0,
    width: 40
  },

  dateWeekday: {
    fontSize: 12
  },

  dateDay: {
    fontSize: 18
  },

  dateMonth: {
    fontSize: 12
  },

  hours: {
    fontSize: 12
  }

};
