// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { AccountService } from '../../../services/account';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { EditProfileScreen } from '../../../../clypr-platform/screens/settings/EditProfile';

type State = {
  isLoading: boolean;
};

type Props = {};

/** Manages shared logic for this screen. */
export class EditProfileScreenContainer extends Component {

  state: State = { isLoading: false, profile: null, role: null };
  props: Props;
  profile: Models.UserProfile = { name: '', avatarUrl: ''};
  role: ?Models.UserRole;

  componentWillMount() {
    // Get initial user data to be edited
    const user = AccountService.getCurrentUser();
    const role = user && user.role;

    // Use a copy for editing
    let profile = user && user.profile && Object.assign({}, user.profile);

    if (profile) { this.profile = profile; }
    if (role) { this.role = role; }
  }

  render() {
    // Get current user profile
    const role = this.role;
    const profile = this.profile;
    
    return (
      <EditProfileScreen
        profile={profile}
        role={role}
        onSave={this.save}
        isLoading={this.state.isLoading} />
    );
  }

  save = (profile: Models.UserProfile) => {
    // Apply changes
    this.setState({ isLoading: true });

    AccountService.updateAccountProfile(profile).then(() => {
      // Success
      this.setState({ isLoading: false });
      NavigationService.goBack();
    }).catch(err => {
      // Show error
      this.setState({ isLoading: false });
      Alert.show(err);
    })
  };

}
