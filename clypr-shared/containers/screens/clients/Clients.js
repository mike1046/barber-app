// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { AppointmentsService } from '../../../services/appointments';
import { NavigationService } from '../../../../services/navigator';

// Import component responsible for rendering this screen in the current platform
import { ClientsScreen } from '../../../../clypr-platform/screens/clients/Clients';

type State = {
  clients: Models.BarberClient[];
  isLoading: boolean;
};

type Props = {};

/** Manages shared logic for Clients screen. */
export class ClientsScreenContainer extends Component {

  state: State = {
    clients: [],
    isLoading: true
  };
  props: Props;
  _observer;

  componentDidMount() {
    // Fetch all clients
    this.fetchClients();
  }

  componentWillUnmount() {
    if (this._observer) { this._observer.unsubscribe(); }
  }

  fetchClients() {
    this.setState({ isLoading: true });

    this._observer = AppointmentsService.observeAllClients(clients => {
      this.setState({ clients, isLoading: false });
    });
  }

  render() {
    return (
      <ClientsScreen
        clients={this.state.clients}
        onSelect={this.openClientDetails}
        isLoading={this.state.isLoading} />
    );
  }

  openClientDetails = (client: Models.BarberClient) => {
    const clientId = client && client.id;
    
    if (clientId) {
      NavigationService.goTo('/clients/'+clientId, { clientId });
    }
  }

}
