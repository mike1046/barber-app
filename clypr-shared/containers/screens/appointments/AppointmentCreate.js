// @flow
import React, { Component } from 'react';
const moment = require('moment');

import * as Models from '../../../models/dataModels';
import { AppointmentsService, type AppointmentOptions } from '../../../services/appointments';
import { BarberSearchService } from '../../../services/barberSearch';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import components responsible for rendering this screen on current platform
import { AppointmentCreateScreen } from '../../../../clypr-platform/screens/appointments/AppointmentCreate';

type State = {
  isLoading: boolean;
  services: Models.BarberService[];
  extraFees?: { label: string, amount: number }[];
};

type Props = {
  barberId: string;
  serviceId?: ?string;
  rescheduleAppointmentId?: ?string;
};

/** Manages shared logic for AppointmentCreate screen. */
export class AppointmentCreateScreenContainer extends Component {

  state: State = {
    isLoading: false,
    services: []
  };
  props: Props;

  componentDidMount() {
    // Load available services for this barber
    if (this.props.barberId) {
      BarberSearchService.getBarberProfile(this.props.barberId).then(barber => {
        // Extract services from barber profile
        if (barber && barber.services) {
          const services = barber.services;
          this.setState({ services });
        } else {
          Alert.show('Barber not found');
        }
      }).catch(err => Alert.show(err));
    }

    // Calculate rescheduling fees
    if (this.props.rescheduleAppointmentId) {
      AppointmentsService.manage(this.props.rescheduleAppointmentId, 'reschedule', {
        verifyOnly: true,
        date: new Date().toISOString()
      }).then(res => {
        // Check penalty charges
        if (res && res.info && res.info.amountToCharge && res.info.amountToCharge > 0) {
          // Add this fee
          this.setState({ extraFees: [{ label: 'Rescheduling', amount: Number(res.info.amountToCharge) }] });
        }
      }).catch(err => Alert.show(err));
    }
  }

  render() {
    return <AppointmentCreateScreen
              barberId={this.props.barberId}
              serviceId={this.props.serviceId}
              services={this.state.services}
              onCreate={this.create}
              isLoading={this.state.isLoading}
              isRescheduling={this.props.rescheduleAppointmentId ? true : false}
              extraFees={this.state.extraFees} />;
  }

  create = (options: AppointmentOptions, predictedAmount: number) => {
    if (this.props.rescheduleAppointmentId) {
      const id = this.props.rescheduleAppointmentId;

      // Make a rescheduling
      // Convert options into rescheduling options
      if (options.date && options.date.month) { options.date.month -= 1; }
      const targetDate = moment(options.date).format('YYYY-MM-DDTHH:mm');

      // Request to API
      this.setState({ isLoading: true });
      AppointmentsService.manage(id, 'reschedule', { date: targetDate }).then(() => {
        this.setState({ isLoading: false });

        // Since it is a rescheduling, go back to appointment details screen
        NavigationService.goBack();
      }).catch(err => {
        this.setState({ isLoading: false });
        Alert.show(err);
      });
    } else {
      // Create a new appointment
      this.setState({ isLoading: true });
      AppointmentsService.create(options, predictedAmount).then(data => {
        this.setState({ isLoading: false });

        // Get appointment data
        const entry = data && data.entry;

        // Show appointment details screen with a new navigation stack
        NavigationService.goToRoute('Appointment', { entry }, true);
      }).catch(err => {
        this.setState({ isLoading: false });
        Alert.show(err);
      });
    }
  }

}
