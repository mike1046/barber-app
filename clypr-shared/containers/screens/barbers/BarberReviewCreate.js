// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import Lang from '../../../services/lang';
import { AppointmentsService } from '../../../services/appointments';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { BarberReviewCreateScreen } from '../../../../clypr-platform/screens/barbers/BarberReviewCreate';

type Props = {
  baseAppointment: Models.Appointment;
};

type State = {
  isLoading: boolean;
}

/** Manages shared logic for Clients screen. */
export class BarberReviewCreateScreenContainer extends Component {

  props: Props;
  state: State = { isLoading: false };

  render() {
    return (
      <BarberReviewCreateScreen onSubmit={this.saveReview} isLoading={this.state.isLoading} />
    );
  }

  saveReview = (ratings: Models.BarberReviewRatings, review: string, tip: number) => {
    if (review &&
        ratings &&
        ratings.haircutQuality &&
        ratings.customerServiceQuality &&
        ratings.barberPunctuality) {
      // Get current appointment id
      const apptId: any = this.props.baseAppointment &&
                          this.props.baseAppointment.id;

      if (apptId) {
        this.setState({ isLoading: true });
        AppointmentsService.createReview(apptId, ratings, review, tip).then(success => {
          // Go to appointment detail screen
          NavigationService.goBack();
        }).catch(err => {
          // Error
          this.setState({ isLoading: false });
          Alert.show(err);
        });
      } else { Alert.show('Could not find appointment information'); }
    } else { Alert.show(Lang('form_field_error')); }
  }
}
