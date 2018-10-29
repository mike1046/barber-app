// @flow
import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';

/** Render actions to be done on an appointment. */
export class AppointmentActions extends Component {

  props: {
    currentUserRole: ?Models.UserRole;
    isCompleted: boolean;
    isReviewed: boolean;
    isCancelled: boolean;
    isPast: boolean;
    isStarted: boolean;

    onSetCompleted: (appt: any, isNoShow: boolean) => void;
    onSetStarted: () => void;
    onStartReview: () => void;
    onQuickBook: () => void;
    onCancel: () => void;
    onReschedule: () => void;
  };

  render() {
    const buttons = [];

    // Button to cancel this appointment
    if (this.props.isCompleted === false &&
        !this.props.isCancelled &&
        !this.props.isPast) {
      buttons.push({ action: this.cancel, label: Lang('action_cancel'), isDanger: true });
    }

    // Buttons for barbers
    if (this.props.currentUserRole === 'barber') {
      // Button to finish this service, if user is barber and service is pending
      if (!this.props.isCancelled && this.props.isCompleted === false && this.props.isPast) {
        if(this.props.isStarted){
          buttons.push({ action: this.complete, label: Lang('appointments_actions_completed') });
        }
        else{
          buttons.push({ action: this.noshow, label: Lang('appointments_actions_noshow') });
          buttons.push({ action: this.started, label: Lang('appointments_actions_started') });
        }
      }
    }

    // Buttons for clients
    if (this.props.currentUserRole === 'client') {
      // Button to reschedule this appointment
      if (this.props.isCompleted === false &&
          !this.props.isCancelled &&
          !this.props.isPast) {
        buttons.push({ action: this.reschedule, label: Lang('appointments_actions_reschedule') });
      }

      // Show button to review this service, if user is client and service is completed
      if (this.props.isCompleted && !this.props.isCancelled && !this.props.isReviewed) {
        buttons.push({ action: this.review, label: Lang('appointments_actions_review') });
      }

      // Show button to book again same service and barber
      if (this.props.isPast || this.props.isCancelled) {
        buttons.push({ action: this.quickBook, label: Lang('appointments_actions_bookAgain') });
      }
    }

    // Add separators between buttons
    if (buttons.length > 1) {
      buttons.splice(1, 0, { isSeparator: true });
    }

    return (
      <View style={style.container}>
        {buttons.map(button => button.isSeparator ? (
          <View style={style.separator} key="separator"></View>
        ) : (
          <Button
            key={button.label}
            full
            style={button.isDanger ? style.button : style.buttonPositive}
            danger={button.isDanger}
            onPress={button.action} >
            <Text>{button.label}</Text>
          </Button>
        ))}
      </View>
    );
  }

  cancel = () => { this.props.onCancel(); };
  reschedule = () => { this.props.onReschedule(); };
  complete = () => { this.props.onSetCompleted(); };
  started = () => { this.props.onSetStarted(); };
  noshow = () => { this.props.onSetCompleted(null, true); };
  review = () => { this.props.onStartReview(); };
  quickBook = () => { this.props.onQuickBook(); };

}

const style = {

  container: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },

  button: { flex: 1 },
  buttonPositive: {},

  separator: {
    backgroundColor: 'transparent',
    width: 1,
    height: 1
  }
};

style.buttonPositive = Object.assign({}, style.button, {
  backgroundColor: Variables.primaryColor
});
