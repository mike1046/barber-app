// @flow
import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Text, Button } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';
import { NavigationService } from '../../../services/navigator';

type Props = {
  entry: Models.Appointment;
};

/** Render a remind for an appointment. */
export class AppointmentReminder extends Component {

  props: Props;

  render() {
    const entry = this.props.entry;
    const date = moment(entry.date);

    // Use cached profile
    const profile = (entry.barber && entry.barber.profile) || (entry.client && entry.client.profile);

    return (
      <TouchableHighlight onPress={this.openDetails} style={{flex: 1}}>
        <View style={style.remind}>
          
          <View style={style.date}>
            <Text style={style.dateWeekday}>{ date.format('ddd') }</Text>
            <Text style={style.dateDay}>{ date.format('D') }</Text>
          </View>

          <View style={style.info}>
            <Text style={style.barber}>{ profile ? profile.name : 'Appointment' }</Text>
            {entry.services && entry.services[0] && (
              <Text style={style.service}>{entry.services[0].label}</Text>
            )}
          </View>

          <View style={style.action}>
            {date >= moment() ?
              <Button transparent onPress={this.openDetails}><Text>{Lang('appointments_actions_details')}</Text></Button> :
              <Button transparent onPress={this.bookAgain}><Text>{Lang('appointments_actions_bookAgain')}</Text></Button>
            }
          </View>

        </View>
      </TouchableHighlight>
    );
  }

  openDetails = (event: any) => {
    event.stopPropagation();
    NavigationService.goTo('/barbers/related/appointment', { entry: this.props.entry });
  }

  bookAgain = (event: any) => {
    event.stopPropagation();
    
    // Get barber and service ids to start a new appointment
    const entry = this.props.entry;
    const barberId = entry.barberId;
    const serviceId = entry.services && entry.services.length > 0 && entry.services[0] && entry.services[0].id;

    // Go to creation screen, forwarding barber's id
    NavigationService.goTo(`/barbers/${barberId}/book`, { barberId, serviceId });
  }

}

const style = {

  remind: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',

    backgroundColor: Variables.primaryLightColor,
  },

  info: {
    flex: 1,
    marginLeft: 10
  },

  date: {
    paddingHorizontal: 10
  },

  dateWeekday: {
    fontSize: 14,
    textAlign: 'center'
  },

  dateDay: {
    fontSize: 16,
    textAlign: 'center'
  },

  barber: {},
  action: {},

  service: {
    fontSize: 14,
    color: Variables.darkGrey
  }

};
