// @flow
import React, { PureComponent } from 'react';

import { AccountService } from '../../../services/account';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { EditCredentialsScreen } from '../../../../clypr-platform/screens/settings/EditCredentials';

type State = {
  isLoading: boolean;
};

type Props = {};

/** Manages shared logic for this screen. */
export class EditCredentialsScreenContainer extends PureComponent {

  state: State = { isLoading: false };
  props: Props;

  render() {
    return (
      <EditCredentialsScreen isLoading={this.state.isLoading} onSubmit={this.process} />
    );
  }

  process = (oldPassword: string, newPassword: string) => {
    this.setState({ isLoading: true });
    AccountService.changePassword(oldPassword, newPassword).then(() => {
      // Success
      NavigationService.goBack();
      this.setState({ isLoading: false });
    }).catch((err: string) => {
      // Show error
      Alert.show(err);
      this.setState({ isLoading: false });
    });
  }

}
