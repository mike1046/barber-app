// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { BarberSearchService, type BarberSearchOptions } from '../../../services/barberSearch';
import { AppointmentsService } from '../../../services/appointments';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import components responsible for rendering this screen on current platform
import { BarberSearchScreen } from '../../../../clypr-platform/screens/barbers/BarberSearch';

type State = {
  barbers: Models.Barber[];
  isLoading: boolean;
  reminder?: ?Models.Appointment;
  options: ?BarberSearchOptions
};

/** Manages shared logic for Barbers Search screen. */
export class BarberSearchScreenContainer extends Component {

  state: State = {
    barbers: [],
    isLoading: false
  };

  static navigationOptions = BarberSearchScreen.navigationOptions;

  componentDidMount() {
    // Perform initial search
    this.performSearch();

    // Load appointments to remind user
    this._observer = AppointmentsService.observeReminderAppointment(reminder => { this.setState({ reminder }); });
  }

  componentWillUnmount(){
    if(this._observer){
      this._observer.unsubscribe();
    }
  }

  /** Search for barbers when search criteria is ready. */
  performSearch = (options?: BarberSearchOptions) => {
    if (!options) { options = this.state.options; }
    
    // Make a new search
    this.setState({ isLoading: true, options });

    BarberSearchService.findBarbers(options).then(barbers => {
      // Show results
      this.setState({ barbers, isLoading: false });
    }).catch(err => {
      // Show error
      Alert.show(err);
      this.setState({ isLoading: false });
    });
  }

  render() {
    return <BarberSearchScreen results={this.state.barbers}
                               options={this.state.options}
                               reminder={this.state.reminder}
                               isLoading={this.state.isLoading}
                               onFilter={this.performSearch}
                               onSelect={this.openBarberProfile}
                               onReload={this.performSearch} />;
  }

  openBarberProfile = (barber: Models.Barber) => {
    const barberId = barber && barber.id;
    
    if (barberId) {
      // Show barber profile
      NavigationService.goTo(`/barbers/${barberId}`);
    }
  }
}
