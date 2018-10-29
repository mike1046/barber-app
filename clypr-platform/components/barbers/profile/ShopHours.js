// @flow
import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
const moment = require('moment');

import Lang from '../../../../clypr-shared/services/lang';
import * as Models from '../../../../clypr-shared/models/dataModels';
import { Variables } from '../../../../styles/global';

type Props = {
  hours: Models.ShopHours;
};

/** Render a list with shop hours for a barber. */
export class ShopHours extends Component {

  props: Props;

  days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  render() {
    const hours = this.props.hours || {};

    return (
      <ScrollView style={style.container}>

        {this.days.map(day => {
          const entry = hours[day];
          const isDayOpen = entry && entry.length > 0;

          return (
            <View key={day} style={style.day}>
              <Text style={style.label}>{Lang('weekdays_short_'+day)}</Text>

              <View>
                {isDayOpen ? entry.map((time, index) => (
                  <Text key={index} style={time.restricted ? style.hoursSpecial : style.hours}>
                    {moment(time.from, 'HH:mm').format('h a')} {Lang('time_interval_to')} {moment(time.to, 'HH:mm').format('h a')}
                  </Text>
                )) : <Text style={style.closed}>{Lang('shop_hours_closed')}</Text>}
              </View>
            </View>
          );
        })}

      </ScrollView>
    );
  }
}

const style = {

  container: {
    maxHeight: 120
  },

  day: {
    flexDirection: 'row'
  },

  label: {
    fontSize: 11,
    width: 30,
    textAlign: 'right',
    marginRight: 5,
    color: Variables.darkGrey
  },

  hours: {
    fontSize: 11,
    color: Variables.darkGrey
  },
  hoursSpecial: {},

  closed: {
    fontSize: 11,
    color: Variables.lightGrey
  }

};

style.hoursSpecial = Object.assign({}, style.hours, {
  color: Variables.lightGrey
});
