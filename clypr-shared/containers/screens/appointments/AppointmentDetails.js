// @flow
import React, {Component} from 'react';

import * as Models from '../../../models/dataModels';
import Lang from '../../../services/lang';
import {AppointmentsService} from '../../../services/appointments';
import {AccountService} from '../../../services/account';
import {NavigationService} from '../../../../services/navigator';
import {Alert} from '../../../../services/alert';
// Import components responsible for rendering this screen on current platform
import {AppointmentDetailsScreen} from '../../../../clypr-platform/screens/appointments/AppointmentDetails';

type Props = { entry: Models.Appointment; disableActions: boolean; };
type State = { role: ?Models.UserRole; isLoading: boolean; }

/** Manages shared logic for Appointments screen. */
export class AppointmentDetailsScreenContainer extends Component {

  props: Props;
  state: State = {role: null, isLoading: false};
  _observer;
  _changesObserver;

  componentDidMount() {
    // Monitor role of logged-in user
    this._observer = AccountService.observeCurrentUser((isLoggedIn, user) => {
      const role = user && user.role;
      this.setState({role});
    });

    // Monitor changes on appointments and re-render if needed
    this._changesObserver = AppointmentsService.observeAllAppointments(() => {
      // Re-render this appointment
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this._observer) {
      this._observer.unsubscribe();
    }
    if (this._changesObserver) {
      this._changesObserver.unsubscribe();
    }
  }

  render() {
    return <AppointmentDetailsScreen
      appointment={this.props.entry}
      currentUserRole={this.state.role}
      isLoading={this.state.isLoading}
      disableActions={this.props.disableActions}

      onSetCompleted={this.setActiveAsCompleted}
      onSetStarted={this.setActiveAsStarted}
      onStartReview={this.startReview}
      onQuickBook={this.bookAgain}
      onCancel={this.cancel}
      onReschedule={this.reschedule}/>;
  }

  setActiveAsCompleted = (target: ?Models.Appointment, isNoShow: boolean = false) => {
    const activeAppointment = target || this.props.entry;

    // Perform after confirmation
    const perform = () => {
      this.setState({isLoading: true});
      AppointmentsService.manage(activeAppointment.id, isNoShow ? 'noshow' : 'complete').then(() => {
        this.setState({isLoading: false});

        // See all appointments again, so barbers can quickly take next action
        NavigationService.goBack();
      }).catch(err => {
        this.setState({isLoading: false});
        Alert.show(err);
      });
    };

    if (activeAppointment) {
      // Confirm no-show before executing
      if (isNoShow) {
        Alert.confirm(
          Lang('appointment_action_noshow_title'),
          Lang('appointment_action_noshow_desc'),
          Lang('appointment_action_noshow_cancel'),
          Lang('appointment_action_noshow_confirm'),
          null,
          perform
        );
      } else {
        // For other operations, just execute command
        perform();
      }
    }
  }

  setActiveAsStarted = (target: ?Models.Appointment) => {
    const activeAppointment = target || this.props.entry;

    // Perform after confirmation
    const perform = () => {
      this.setState({isLoading: true});
      AppointmentsService.manage(activeAppointment.id, 'start').then(() => {
        this.setState({isLoading: false});
      }).catch(err => {
        this.setState({isLoading: false});
        Alert.show(err);
      });
    };

    perform();
  }

  startReview = (target: ?Models.Appointment) => {
    // Go to review screen with this appointment as base
    const baseAppointment = target || this.props.entry;
    NavigationService.goToRoute('Review', {baseAppointment});
  }

  bookAgain = (reschedule: boolean = false) => {
    // Get barber and service ids to start a new appointment
    const entry = this.props.entry;
    const barberId = entry.barberId;
    const serviceId = entry.services && entry.services.length > 0 && entry.services[0] && entry.services[0].id;
    const rescheduleAppointmentId = (reschedule && entry.id) || null;

    // Go to creation screen, forwarding barber's id
    NavigationService.goToRoute('Book', {barberId, serviceId, rescheduleAppointmentId});
  }

  cancel = () => {
    // Perform operation when ready
    const perform = () => {
      this.setState({isLoading: true});
      AppointmentsService.manage(this.props.entry.id, 'cancel').then(() => {
        this.setState({isLoading: false});
      }).catch(err => {
        this.setState({isLoading: false});
        Alert.show(err);
      });
    };

    if (this.state.role === 'client') {
      // Call API to calculate any penalties to be charged
      this.setState({isLoading: true});
      AppointmentsService.manage(this.props.entry.id, 'cancel', {verifyOnly: true}).then(res => {
        this.setState({isLoading: false});

        // Check penalty charges
        if (res && res.info && res.info.amountToCharge && res.info.amountToCharge > 0) {
          // Confirm operation with predicted charges
          Alert.confirm(
            Lang('appointment_action_cancel_title'),
            Lang('appointment_action_cancel_charge').replace('__AMOUNT__', res.info.amountToCharge),
            Lang('appointment_action_cancel_close'),
            Lang('appointment_action_cancel_accept'),
            null,
            perform
          );
        } else {
          // No charges will apply, just confirm operation
          Alert.confirm(
            Lang('appointment_action_cancel_title'),
            Lang('appointment_action_cancel_noCharge'),
            Lang('appointment_action_cancel_close'),
            Lang('appointment_action_cancel_accept'),
            null,
            perform
          );
        }
      }).catch(err => {
        this.setState({isLoading: false});
        Alert.show(err);
      });
    } else {
      // Perform operation
      perform();
    }
  }

  reschedule = () => {
    // Check if appointment was rescheduled in the past
    let message = Lang('appointment_action_reschedule_firstTime');
    if (this.props.entry.rescheduled) {
      // Change message to rescheduling again
      message = Lang('appointment_action_reschedule_secondTime');
    }

    // Warn user about reschedule conditions
    Alert.confirm(
      Lang('appointment_action_reschedule_title'),
      message,
      Lang('appointment_action_reschedule_close'),
      Lang('appointment_action_reschedule_accept'),
      null,
      () => {
        // Initiate a quick book as reschedule
        this.bookAgain(true);
      }
    );
  }

}
