// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { AppointmentsService } from '../../../services/appointments';
import { AccountService } from '../../../services/account';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import components responsible for rendering this screen on current platform
import { AppointmentsListScreen } from '../../../../clypr-platform/screens/appointments/AppointmentsList';

type State = {
  entries: Models.Appointment[];
  isLoading: boolean;
  role: ?Models.UserRole;
};

type Props = {};

/** Manages shared logic for Appointments screen. */
export class AppointmentsListScreenContainer extends Component {

  state: State;
  _observer;
  _observerAppointment;
  constructor(props: Props) {
    super(props);
    
    // Get current user role
    const user = AccountService.getCurrentUser();
    const role = user && user.role;

    this.state = {
      role,
      entries: [],
      isLoading: false
    };
  }

  componentDidMount() {
    // Perform initial fetch
    this.getEntries();

    // Monitor role of logged-in user
    this._observer = AccountService.observeCurrentUser((isLoggedIn, user) => {
      const role = user && user.role;
      this.setState({ role });
    });
  }

  componentWillUnmount() {
    if (this._observer) { this._observer.unsubscribe(); }
    if (this._observerAppointment) { this._observerAppointment.unsubscribe(); }
  }

  /** Fetch and show proper appointments. */
  getEntries() {
    // Make a new search
    this.setState({ isLoading: true });

    this._observerAppointment = AppointmentsService.observeAllAppointments(entries => {
      // Show results
      this.setState({ entries, isLoading: false });
    });
  }

  render() {
    return <AppointmentsListScreen
              viewMode={this.state.role || 'client'}
              entries={this.state.entries}

              onSelect={this.selectAppointment}
              onSetCompleted={this.setActiveAsCompleted}
              onStartReview={this.startReview} />;
  }

  selectAppointment = (entry: Models.Appointment) => {
    NavigationService.goTo('/appointments/details', { entry });
  }

  setActiveAsCompleted = (target: ?Models.Appointment) => {
    const activeAppointment = target;

    if (activeAppointment) {
      AppointmentsService.manage(activeAppointment.id, 'complete').then(() => {
        // Go to appointments screen
        NavigationService.goBack();
      }).catch(err => Alert.show(err));
    }
  }

  startReview = (target: ?Models.Appointment) => {
    // Go to review screen with this appointment as base
    const baseAppointment = target;
    NavigationService.goTo('/appointments/review', { baseAppointment });
  }

}
