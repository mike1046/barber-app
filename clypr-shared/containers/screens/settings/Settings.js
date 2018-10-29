// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { AccountService } from '../../../services/account';

// Import component responsible for rendering this screen in the current platform
import { SettingsScreen } from '../../../../clypr-platform/screens/settings/Settings';
import { NavigationService } from '../../../../services/navigator';

type State = {
  user: ?Models.User;
};

type Props = {};

/** Manages shared logic for Settings screen. */
export class SettingsScreenContainer extends Component {

  state: State = { user: null };
  props: Props;
  _loginListener;

  componentDidMount() {
    // Subscribe for login state
    this._loginListener = AccountService.observeCurrentUser((loggedIn, user) => this.setState({ user }));
  }

  componentWillUnmount() {
    // Unsubscribe from login changes
    if (this._loginListener) { this._loginListener.unsubscribe(); }
  }

  render() {
    // Choose user role
    const role = this.state.user && this.state.user.role;
    
    return <SettingsScreen onNavigate={this.navigate} role={role} />;
  }

  navigate = (path: string) => {
    // Go to settings page
    NavigationService.goTo(path);
  }

}
