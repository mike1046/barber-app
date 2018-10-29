// @flow
import React, { Component } from 'react';
import firebase from 'react-native-firebase';

import { AccountService } from '../../services/account';
import Lang from '../../services/lang';
import { Alert } from '../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { LoginScreen } from '../../../clypr-platform/screens/login/Login';

type Props = {};
type State = { isLoading: boolean; }

/** Manages shared logic for Login screen. */
export class LoginScreenContainer extends Component {

  props: Props;
  state: State = { isLoading: false };

  render() {
    return (
      <LoginScreen
        isLoading={this.state.isLoading}
        onLogin={this.login}
        onRegister={this.register}
        onRecover={this.requestRecovery} />
    );
  }

  login = (params: { email: string, password: string }) => {
    this.setState({ isLoading: true });

    AccountService.loginWithService('email', params).catch(err => {
      this.setState({ isLoading: false });
      Alert.show(err);
    });
  }

  register = (params: { email: string, password: string, name: string, role: 'barber' | 'client' }) => {
    this.setState({ isLoading: true });

    AccountService.registerWithEmail(params.email, params.password, params.name, params.role).catch(err => {
      this.setState({ isLoading: false });
      Alert.show(err);
    });
  }

  requestRecovery = (params: { email: string }) => {
    this.setState({ isLoading: true });
    
    // Request recovery for Firebase
    firebase.auth().sendPasswordResetEmail(params.email).then(() => {
      this.setState({ isLoading: false });
      Alert.show(Lang('recovery_success'));
    }).catch(err => {
      this.setState({ isLoading: false });
      Alert.show(err);
    });
  }

}
