// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { BarberSearchService } from '../../../services/barberSearch';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import components responsible for rendering this screen on current platform
import { BarberProfileScreen } from '../../../../clypr-platform/screens/barbers/BarberProfile';

type Props = {
  barberId: string;
};

type State = {
  barber: ?Models.Barber;
  isLoading: boolean;
};

/** Manages shared logic for Barber Profile screen. */
export class BarberProfileScreenContainer extends Component {

  state: State = { barber: null, isLoading: false };
  props: Props;

  componentDidMount() {
    // Get information about active barber
    const barberId = this.props.barberId;

    if (barberId) {
      // Fetch barber profile
      this.setState({ isLoading: true });
      BarberSearchService.getBarberProfile(barberId).then(barber => {
        if (barber) {
          // Show profile
          this.setState({ barber, isLoading: false });
        } else {
          // Barber not found
          Alert.show('Error: Barber information not found.');
          this.setState({ barber: null, isLoading: false });
        }
      }).catch(err => Alert.show(err));
    } else {
      // Barber not found
      Alert.show('Error: Barber information not found.');
      this.setState({ barber: null, isLoading: false });
    }
  }

  render() {
    return <BarberProfileScreen
              barber={this.state.barber}
              isLoading={this.state.isLoading}
              onCreateAppointment={this.createAppointment} />;
  }

  createAppointment = (withSelectedServiceId?: string) => {
    // Get target barber id
    const targetBarberId = this.props.barberId;
    const data = {
      barberId: targetBarberId,
      serviceId: withSelectedServiceId
    };

    if (targetBarberId) {
      // Go to creation screen, forwarding barber's id
      NavigationService.goTo(`/barbers/${targetBarberId}/book`, data);
    }
  }

}
