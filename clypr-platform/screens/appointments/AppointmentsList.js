// @flow
import React, { Component } from 'react';
import { View, Segment, Button, Text } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles } from '../../../styles/global';
import { AppointmentsList } from '../../components/appointments/AppointmentsList';
import { SchedulePicker }from '../../components/appointments/schedule/SchedulePicker';

type Props = {
  viewMode: Models.UserRole;
  entries: Models.Appointment[];
  onSelect: (entry: Models.Appointment) => void;
};

type State = {
  filterByType: 'upcoming' | 'past';
  filterByDate: Date;
};

/** Implements Appointments List screen for Web platform. */
export class AppointmentsListScreen extends Component {

  props: Props;
  state: State;
  constructor(props: Props) {
    super(props);

    this.state = {
      filterByType: 'upcoming',
      filterByDate: new Date()
    };
  }

  render() {
    let datesWithBadges = {};
    if (this.props.viewMode === 'barber') {
      // Add badges counting days with appointments
      this.props.entries.forEach(appt => {
        const date = appt.date.split('T')[0];
        
        datesWithBadges[date] = datesWithBadges[date] || 0;
        datesWithBadges[date]++;
      });
    }

    return (
      <View style={style.container}>
        
        {/* Client filter bar. */}
        {this.props.viewMode === 'client' && (
          <Segment style={style.segment}>
            <Button first
                    active={this.state.filterByType === 'upcoming'}
                    onPress={() => { this.setState({ filterByType: 'upcoming' }); }}>
              <Text>{Lang('appointments_list_filter_future')}</Text>
            </Button>

            <Button last
                    active={this.state.filterByType === 'past'}
                    onPress={() => { this.setState({ filterByType: 'past' }); }}>
              <Text>{Lang('appointments_list_filter_past')}</Text>
            </Button>
          </Segment>
        )}

        {/* Barber date picker. */}
        {this.props.viewMode === 'barber' && (
          <View style={style.datePicker}>
            <SchedulePicker onSelect={filterByDate => { this.setState({ filterByDate }); }}
                            activeDate={this.state.filterByDate}
                            enablePastDates={true}
                            datesWithBadges={datesWithBadges} />
          </View>
        )}

        <View style={style.content}>
          <AppointmentsList
            entries={this.getFilteredAppointments()}
            onSelect={this.props.onSelect}
            showTimeOnly={this.props.viewMode === 'barber'} />
        </View>

      </View>
    );
  }

  // Filter appointments according to active filter
  getFilteredAppointments: () => Models.Appointment[] = () => {
    return this.props.viewMode === 'barber' ?
      this.filterForBarber(this.props.entries) : this.filterForClient(this.props.entries);
  };

  filterForClient = (appts: Models.Appointment[]): Models.Appointment[] => {
    const now = moment().unix();
    const results = appts.filter(appt => (
      // Include if date is inside range from active filter
      this.state.filterByType === 'upcoming' ?
        ((appt._dateUTC || 0) >= now && appt.status !== 'cancelled') // Show future ones and not cancelled
        :
        ((appt._dateUTC || 0) < now || appt.status === 'cancelled') // Show past ones or cancelled future ones
    ));
    
    // Inverse order if seeing past appointments, showing recent dates and hours first
    if (this.state.filterByType === 'past') { results.reverse(); }

    return results;
  }
  
  filterForBarber = (appts: Models.Appointment[]): Models.Appointment[] => {
    return appts.filter(entry => {
      // Include if date is same than active filter, without the hour part
      const item = new Date(entry.date);
      const target = new Date(this.state.filterByDate);

      return item.getUTCFullYear() === target.getUTCFullYear() &&
             item.getUTCMonth() === target.getUTCMonth() &&
             item.getUTCDate() === target.getUTCDate();
    });
  }
}

const style = {

  container: {
    flex: 1
  },

  content: {
    flex: 1
  },

  datePicker: {
    flex: 0,
    height: 80
  },

  segment: {
    backgroundColor: 'transparent',
    flex: 0,
    marginTop: 10
  }

};
