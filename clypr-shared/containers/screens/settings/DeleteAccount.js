// @flow
import React, { PureComponent } from 'react';

import { AccountService } from '../../../services/account';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { DeleteAccountScreen } from '../../../../clypr-platform/screens/settings/DeleteAccount';

type State = {
  isLoading: boolean;
};

type Props = {};

/** Manages shared logic for this screen. */
export class DeleteAccountScreenContainer extends PureComponent {

  state: State = { isLoading: false };
  props: Props;

  render() {
    return (
      <DeleteAccountScreen isLoading={this.state.isLoading} onSubmit={this.process} />
    );
  }

  process = (currentPassword: string) => {
    this.setState({ isLoading: true });
    AccountService.deleteAccount(currentPassword).then(() => {
      // Success. Do nothing. User will be logged out.
    }).catch((err: string) => {
      // Show error
      Alert.show(err);
      this.setState({ isLoading: false });
    });
  }

}
