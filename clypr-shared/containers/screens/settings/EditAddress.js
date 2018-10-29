// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { ShopService } from '../../../services/shop';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { EditAddressScreen } from '../../../../clypr-platform/screens/settings/EditAddress';

type State = {
  isLoading: boolean;
};

/** Manages shared logic for this screen. */
export class EditAddressScreenContainer extends Component {

  state: State = { isLoading: false };
  address: Models.EncodedAddress = {
    shopName: '',
    street: '',
    street2: '',
    city: '',
    state: 'FL',
    zipcode: '',
    timezone: 'US/Eastern'
  };

  componentWillMount() {
    // Get initial data to be edited
    const barber = ShopService.getCurrentBarber();
    
    // Use a copy for editing
    const address = barber && barber.shop && barber.shop.address && Object.assign({}, barber.shop.address);
    if (address) { this.address = address; }
  }

  render() {
    // Get current barber address
    const address = this.address;

    return (
      <EditAddressScreen onSave={this.save}
                         address={address}
                         isLoading={this.state.isLoading} />
    );
  }

  save = (address: Models.EncodedAddress) => {
    this.setState({ isLoading: true });
    ShopService.updateAddress(address).then(() => {
      // Success
      NavigationService.goBack();
      this.setState({ isLoading: false });
    }).catch(err => {
      Alert.show(err);
      this.setState({ isLoading: false });
    })
  };

}
