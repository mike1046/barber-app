// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { View, Text, Button, List, ListItem, Left, Right, Body, Thumbnail,
         Card, CardItem } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';

type Props = {
  entries: Models.Appointment[];
  onSelect: (entry: Models.Appointment) => void;
  showTimeOnly?: boolean;
};

/** Render results for current appointments. */
export class AppointmentsList extends Component {

  props: Props;

  render() {
    const entries = this.props.entries;

    return entries.length > 0 ? (
      <FlatList
        data={entries}
        keyExtractor={this._keyExtractor}
        renderItem={({item}) => this.renderItem(item)}
        style={style.list} />
    ) : <Text style={style.empty}>{Lang('appointments_list_empty')}</Text>;
  }

  _keyExtractor = (item, index) => item.id;

  renderItem(entry: Models.Appointment) {
    // Parse date
    const date = moment(entry.date);

    // Use cached profile
    const profile = (entry.barber && entry.barber.profile) || (entry.client && entry.client.profile);
    
    return (
      <Card key={entry.id}>
        <CardItem
          button
          onPress={() => { this.props.onSelect(entry); }}
          style={entry.status === 'cancelled' ? style.cardDisabled : style.card} >

          <Left style={Styles.listItemSides}>
            <Thumbnail source={
              profile && profile.avatarUrl ?
                { uri: profile.avatarUrl } : require('../../../assets/avatar.png')
            } />
          </Left>

          <Body style={{...Styles.listItemBody, ...style.body}}>
            {entry.status === 'cancelled' && <Text style={style.cancelled}>{Lang('appointments_list_notes_cancelled')}</Text>}

            {profile && <Text>{ profile.name }</Text>}
            {entry.services && entry.services.length > 0 && (
              <Text note>${entry.services[0].price} {entry.services[0].label}</Text>
            )}
          </Body>

          <Right style={Styles.listItemSides}>
            {this.props.showTimeOnly ? (
              <Text style={style.hours}>{ date.format('h:mm a') }</Text>
            ) : (
              <View>
                <Text style={style.dateWeekday}>{ date.format('ddd') }</Text>
                <Text style={style.dateDay}>{ date.format('D') }</Text>
                <Text style={style.dateMonth}>{ date.format('MMM') }</Text>
              </View>
            )}
          </Right>

        </CardItem>
      </Card>
    );
  }
}

const style = {

  card: {},
  cardDisabled: {
    backgroundColor: '#eee'
  },

  list: {
    padding: 10
  },

  body: {
    justifyContent: 'center'
  },

  empty: {
    margin: 10,
    textAlign: 'center'
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
    fontSize: 18
  },

  cancelled: {
    color: Variables.dangerColor,
    fontSize: 14,
    marginBottom: 5
  }

};
