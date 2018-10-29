// @flow
import React, { Component } from 'react';

// Import component responsible for rendering this screen in the current platform
import { PaymentMethodsScreen } from '../../../../clypr-platform/screens/payments/Methods';

/** Manages shared logic for this screen. */
export class PaymentMethodsScreenContainer extends Component {

  render() {
    return (
      <PaymentMethodsScreen />
    );
  }

}
