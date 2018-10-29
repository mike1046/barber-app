// @flow
import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Icon } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';
import { AppointmentDetails } from '../../components/appointments/AppointmentDetails';
import { AppointmentActions } from '../../components/appointments/AppointmentActions';
import { Loading } from '../../components/Loading';

/** Implements Appointment Details screen for Web platform. */
export class AppointmentDetailsScreen extends Component {

  props: {
    appointment: Models.Appointment;
    currentUserRole: ?Models.UserRole;
    isLoading: boolean;
    disableActions: boolean;

    onSetCompleted: (appt: any, isNoShow: boolean) => void;
    onSetStarted: () => void;
    onStartReview: () => void;
    onQuickBook: () => void;
    onCancel: () => void;
    onReschedule: () => void;
  };

  render() {
    if (this.props.isLoading) { return <Loading />; }
    const now = moment().unix();
    let disableActions = this.props.disableActions;

    // If appointment has not a UTC date, then disabled actions.
    // That happens to new appointments which uses details from remote server and are not ready yet for editing.
    if (!this.props.appointment._dateUTC) { disableActions = true; }

    return (
      <View style={style.container}>
        <ScrollView>
          <AppointmentDetails entry={this.props.appointment} role={this.props.currentUserRole} />
        </ScrollView>

        <View style={style.footer}>
          {this.renderStatus(this.props.appointment)}

          {!disableActions && (
            <AppointmentActions
              currentUserRole={this.props.currentUserRole}
              isCompleted={this.props.appointment.status.indexOf('completed') >= 0 || this.props.appointment.status === 'noshow'}
              isReviewed={this.props.appointment.status === 'completed-and-reviewed'}
              isCancelled={this.props.appointment.status === 'cancelled'}
              isStarted={this.props.appointment.status === 'started'}
              isPast={(this.props.appointment._dateUTC || 0) <= now}

              onSetCompleted={this.props.onSetCompleted}
              onSetStarted={this.props.onSetStarted.bind(this, this.props.appointment)}
              onStartReview={this.props.onStartReview}
              onQuickBook={this.props.onQuickBook}
              onCancel={this.props.onCancel}
              onReschedule={this.props.onReschedule} />
          )}
        </View>
      </View>
    );
  }

  renderStatus(appt: Models.Appointment) {
    const status = appt && appt.status;
    let text = Lang('appointments_status_unknown');
    let icon = 'question';

    const now = moment().unix();
    const isPast = appt && appt._dateUTC && appt._dateUTC < now;

    if (status === 'scheduled' && !isPast) {
      text = Lang('appointments_status_scheduled');
      icon = 'calendar';
    } else if (status === 'scheduled' && isPast) {
      text = Lang('appointments_status_scheduledPast');
      icon = 'clock';
    } else if (status === 'started') {
      text = Lang('appointments_status_started');
      icon = 'alert';
    } else if (status === 'cancelled') {
      text = Lang('appointments_status_cancelled');
      icon = 'alert';
    } else if (status === 'noshow') {
      text = Lang('appointments_status_noshow');
      icon = 'remove-circle';
    } else if (status === 'completed' || status === 'completed-and-reviewed') {
      text = Lang('appointments_status_completed');
      icon = 'thumbs-up';
    }
    
    return (
      <View style={style.status}>
        <Icon name={icon} style={style.statusIcon} />
        <Text style={style.statusText}>{text}</Text>
      </View>
    );
  }

}

const style = {
  container: { flex: 1 },
  footer: { flex: 0 },

  status: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Variables.primaryLightColor,
    borderTopWidth: 1,
    borderTopColor: Variables.disabledGrey
  },
  statusIcon: {
    marginRight: 10,
    fontSize: 25
  },
  statusText: {
    fontSize: 16
  }
};
