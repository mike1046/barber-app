// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { PaymentsService } from '../../../services/payments';
import { AppointmentsService } from '../../../services/appointments';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { PaymentHistoryScreen } from '../../../../clypr-platform/screens/payments/History';

type State = {
  payments: Models.Payment[];
  isLoading: boolean;
};

type Props = {};

/** Manages shared logic for this screen. */
export class PaymentHistoryScreenContainer extends Component {

  state: State = {
    payments: [],
    isLoading: true
  };
  props: Props;
  _observer;

  componentDidMount() {
    // Listen for all payments
    this.setState({ isLoading: true });
    
    this._observer = PaymentsService.observeAllPayments(payments => {
      this.setState({ payments, isLoading: false });
    });
  }

  componentWillUnmount() {
    if (this._observer) { this._observer.unsubscribe(); }
  }

  render() {
    return (
      <PaymentHistoryScreen
        payments={this.state.payments}
        isLoading={this.state.isLoading}
        onSelect={this.openDetails} />
    );
  }

  openDetails = (payment: Models.Payment) => {
    if (payment && payment.details && payment.details.appointmentId) {
      // Load appointment details
      const id = payment.details.appointmentId;
      AppointmentsService.getAppointment(id).then(entry => {
        if (entry) {
          // Go to appointment details screen
          NavigationService.goTo('/settings/related/appointments/details', { entry, disableActions: true });
        } else {
          Alert.show('Could not find the appointment details for this payment.');
        }
      }).catch(err => Alert.show(err));
    } else {
      Alert.show('This payment has not associated information to be shown.');
    }
  }

}
