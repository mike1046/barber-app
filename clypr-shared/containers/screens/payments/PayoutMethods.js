// @flow
import React, { Component } from 'react';

// Import component responsible for rendering this screen in the current platform
import { PayoutMethodsScreen } from '../../../../clypr-platform/screens/payments/PayoutMethods';

/** Manages shared logic for this screen. */
export class PayoutMethodsScreenContainer extends Component {

  render() {
    return (
      <PayoutMethodsScreen />
    );
  }

}
