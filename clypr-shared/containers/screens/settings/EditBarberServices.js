// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { ShopService } from '../../../services/shop';

// Import component responsible for rendering this screen in the current platform
import { EditBarberServicesScreen } from '../../../../clypr-platform/screens/settings/EditBarberServices';

type State = {
  isLoading: boolean;
  services: Models.BarberService[];
};

type Props = {};

/** Manages shared logic for this screen. */
export class EditBarberServicesScreenContainer extends Component {

  state: State = { isLoading: false, services: [] };
  props: Props;
  _subscription;

  componentDidMount() {
    // Observer barber data
    this._subscription = ShopService.observeCurrentBarber(barber => {
      let services = (barber && barber.services) || [];

      // Make a deep copy for editing
      services = services.map(s => Object.assign({}, s));

      this.setState({ services });
    });
  }

  componentWillUnmount() {
    if (this._subscription) { this._subscription.unsubscribe(); }
  }

  render() {
    // Get current shop services
    const services = this.state.services;

    return (
      <EditBarberServicesScreen
        services={services}
        isLoading={this.state.isLoading} />
    );
  }

}
