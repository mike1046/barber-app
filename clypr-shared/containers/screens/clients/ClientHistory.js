// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { AccountService } from '../../../services/account';
import { AppointmentsService } from '../../../services/appointments';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { ClientHistoryScreen } from '../../../../clypr-platform/screens/clients/ClientHistory';

type Props = {
  clientId: string;
};

type State = {
  isLoading: boolean;
  history: Models.Appointment[];
  client: ?Models.BarberClient;
};

/** Manages shared logic for Clients screen. */
export class ClientHistoryScreenContainer extends Component {

  state: State = {
    isLoading: false,
    history: [],
    client: null
  };
  props: Props;
  _observer;
  _profileObserver;

  componentDidMount() {
    // Fetch client information
    this.fetchHistory();
  }

  componentWillUnmount() {
    if (this._observer) { this._observer.unsubscribe(); }
  }

  fetchHistory() {
    this.setState({ isLoading: true });

    // Load user profile
    this._profileObserver = AppointmentsService.observeAllClients(clients => {
      // Find this client
      const client = clients.find(c => c.id === this.props.clientId);
      this.setState({ client });
    });

    // Get past and future appointments with this client
    this._observer = AppointmentsService.observeAllAppointments(appts => {
      // Filter by client
      const history = appts.filter(appt => appt.clientId === this.props.clientId);
      
      this.setState({ history, isLoading: false });
    });
  }

  render() {
    return <ClientHistoryScreen
              appointments={this.state.history}
              client={this.state.client}
              isLoading={this.state.isLoading}
              onSelect={this.selectAppointment}
              onFavoriteChange={this.updateFavoriteStatus} />;
  }

  selectAppointment = (entry: Models.Appointment) => {
    NavigationService.goTo('/clients/'+this.props.clientId+'/appointment', { entry });
  }

  updateFavoriteStatus = (clientId: string, isFavorite: boolean) => {
    this.setState({ isLoading: true });
    
    AccountService.setPreferredUser(clientId, isFavorite).then(() => {
      this.setState({ isLoading: false });
    }).catch(err => {
      Alert.show(err);
      this.setState({ isLoading: false });
    })
  };

}
