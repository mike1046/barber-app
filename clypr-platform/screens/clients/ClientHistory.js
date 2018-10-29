// @flow
import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text, Switch } from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';
import { Loading } from '../../components/Loading';
import { BarberAvatar } from '../../components/barbers/profile/BarberAvatar';
import { ClientHistoryList } from '../../components/clients/ClientHistoryList';
import { FavoriteStatus } from '../../components/clients/FavoriteStatus';

type Props = {
  isLoading: boolean;
  appointments: Models.Appointment[];
  client: ?Models.BarberClient;
  onSelect: (appt: Models.Appointment) => void;
  onFavoriteChange: (clientId: string, isFavorite: boolean) => void;
};
type State = {};

/** Implements Client History screen for Web platform. */
export class ClientHistoryScreen extends Component {

  props: Props;
  state: State;

  render() {
    if (this.props.isLoading) { return <Loading />; }
    const client = this.props.client;

    return (
      <View style={style.container}>

        {client && (
          <View style={style.profile}>
            
            {/* Client avatar. */}
            <View style={style.avatar}>
              <Image style={style.avatarImage}
                     source={client.avatarUrl ? { uri: client.avatarUrl } : require('../../../assets/avatar.png')} />
              <Text style={style.avatarName}>{client.name}</Text>
            </View>

            {/* Preferred client status. */}
            <View style={style.favorite}>

              <View style={style.favoriteChoose}>
                <Switch value={client.isFavorite} onValueChange={(val: boolean) => this.toggleFavorite(val)} />
                <Text style={style.favoriteText}>{Lang('client_profile_preferred_button')}</Text>
              </View>

              <Text style={style.favoriteDesc}>{Lang('client_profile_preferred_desc')}</Text>
            </View>
          </View>
        )}

        {/* History. */}
        {this.props.appointments && this.props.appointments.length > 0 ? (
          <ClientHistoryList entries={this.props.appointments} onSelect={this.props.onSelect} />
        ) : (
          <Text style={Styles.title}>{Lang('client_profile_history_empty')}</Text>
        )}

      </View>
    );
  }

  toggleFavorite = (isFavorite: boolean) => {
    const client = this.props.client;
    if (client && client.id) { this.props.onFavoriteChange(client.id, isFavorite); }
  };
}

const style = {
  container: { flex: 1 },
  profile: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  avatar: {
    alignItems: 'center'
  },

  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35
  },

  avatarName: {
    fontSize: 16,
    marginTop: 10
  },

  favorite: {
    flex: 1,
    padding: 10,
    backgroundColor: Variables.primaryLightColor,
    marginLeft: 30,
    borderRadius: 5,
  },

  favoriteChoose: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },

  favoriteText: {
    fontSize: 16,
    marginLeft: 10
  },

  favoriteDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 17
  }
};
