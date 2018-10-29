// @flow
import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';

import { Styles } from '../../../styles/global';
import { BarberProfileScreen } from '../barbers/BarberProfile';
import { ShopService } from '../../../clypr-shared/services/shop';
import { Alert } from '../../../services/alert';
import { BarberSearchService } from '../../../clypr-shared/services/barberSearch';
import { Loading } from '../../components/Loading';

type Props = {};

type State = { isLoading: boolean; barber: ?Models.Barber; }

/** Implements this screen for Native platform. */
export class ProfilePreviewScreen extends Component {

  props: Props;
  state: State = { isLoading: false, barber: null };

  componentDidMount() {
    // Get current barber
    const barber = ShopService.getCurrentBarber();
    if (barber && barber.id) {
      // Get full barber profile
      this.setState({ isLoading: true });
      BarberSearchService.getBarberProfile(barber.id).then(fullProfile => {
        this.setState({ barber: fullProfile, isLoading: false });
      }).catch(err => {
        this.setState({ barber, isLoading: false });
      });
    } else { Alert.show('Please login first'); }
  }

  render() {
    if (this.state.isLoading || !this.state.barber) { return <Loading />; }

    // Render barber profile screen inside this one
    return <BarberProfileScreen
              barber={this.state.barber}
              isLoading={false}
              isPreviewMode={true}
              onCreateAppointment={() => {}} />
  }

}
