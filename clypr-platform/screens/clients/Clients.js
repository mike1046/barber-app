// @flow
import React, { Component } from 'react';
import { Text } from 'react-native';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles } from '../../../styles/global';
import { ClientsList } from '../../components/clients/ClientsList';
import { Loading } from '../../components/Loading';

type Props = {
  clients: Models.BarberClient[];
  isLoading: boolean;
  onSelect: (client: Models.BarberClient) => void;
};

type State = {};

/** Implements Clients screen for Web platform. */
export class ClientsScreen extends Component {

  props: Props;

  render() {
    if (this.props.isLoading) { return <Loading />; }

    return this.props.clients && this.props.clients.length > 0 ? (
      <ClientsList entries={this.props.clients} onSelect={this.props.onSelect} />
    ) : <Text style={Styles.title}>{Lang('client_list_empty')}</Text>;
  }
}
