// @flow
import React, { Component } from 'react';
import { Modal, Slider } from 'react-native';
import { View, Button, Text } from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles } from '../../../styles/global';
import { NavigationService } from '../../../services/navigator';
import type { BarberSearchOptions } from '../../../clypr-shared/services/barberSearch';
import { BarberSearchResults } from '../../components/barbers/barberSearchResults/BarberSearchResults';
import { BarberSearchFilters } from '../../components/barbers/BarberSearchFilters';
import { AppointmentReminder } from '../../components/appointments/AppointmentReminder';

type State = {
  showFilters: boolean;
};

type Props = {
  isLoading: boolean;
  results: Models.Barber[];
  reminder?: ?Models.Appointment;
  options: ?BarberSearchOptions;
  onReload: (options: BarberSearchOptions) => void;
  onFilter: (options: BarberSearchOptions) => void;
  onSelect: (barber: Models.Barber) => void;
};

/** Implements Barber Search screen for Web platform. */
export class BarberSearchScreen extends Component {

  state: State = {
    showFilters: false
  };
  props: Props;

  static navigationOptions = () => ({
    headerRight: (
      <Button
        transparent
        onPress={NavigationService.screenAction('/barbers', 'toggleFilterModal')}>
        <Text style={Styles.nativePrimaryColor}>{Lang('barbers_filter_button')}</Text>
      </Button>
    )
  });
  
  componentDidMount() {
    // Register this instance to be accessible by actions taken in navigation header
    NavigationService.registerScreenInstance('/barbers', this);
  }

  render() {
    return (
      <View style={style.container}>
        
        <View style={{flex: 1}}>
          <View style={style.results}>
            <BarberSearchResults
              barbers={this.props.results}
              onSelect={this.props.onSelect}
              onReload={this.props.onReload}
              isLoading={this.props.isLoading} />
          </View>

          {this.props.reminder && (
            <View style={style.footer}>
              <AppointmentReminder entry={this.props.reminder} />
            </View>
          )}
        </View>

        <Modal
          animationType={"slide"}
          transparent={false}
          onRequestClose={this.toggleFilterModal}
          visible={this.state.showFilters} >
          <BarberSearchFilters
            options={this.props.options}
            onSearch={this.filter}
            onClose={this.toggleFilterModal} />
        </Modal>

      </View>
    );
  }

  toggleFilterModal = () => {
    this.setState(prev => {
      return { showFilters: !prev.showFilters };
    });
  }

  filter = (options: BarberSearchOptions) => {
    this.toggleFilterModal();
    this.props.onFilter(options);
  }
}

const style = {

  container: {
    flex: 1
  },

  results: {
    flex: 1,
    paddingHorizontal: 10
  },

  footer: {
    flex: 0,
    height: 60
  }
  
};
