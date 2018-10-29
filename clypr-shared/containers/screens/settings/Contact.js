// @flow
import React, { Component } from 'react';

// Import component responsible for rendering this screen in the current platform
import { ContactScreen } from '../../../../clypr-platform/screens/settings/Contact';
import { API } from '../../../../services/api';
import { Alert } from '../../../../services/alert';

type State = {
  isLoading: boolean;
  isCompleted: boolean;
}

/** Manages shared logic for this screen. */
export class ContactScreenContainer extends Component {
  
  state: State = {
    isLoading: false,
    isCompleted: false
  };

  render() {
    return <ContactScreen
              onSubmitMessage={this.sendMessage}
              isLoading={this.state.isLoading}
              isCompleted={this.state.isCompleted} />;
  }

  sendMessage = (message: string) => {
    // Use API service to send message
    this.setState({ isLoading: true });
    API.sendSupportMessage(message).then(() => {
      // Success!
      this.setState({ isLoading: false, isCompleted: true });
    }).catch(err => {
      // Show error
      this.setState({ isLoading: false, isCompleted: false });
      Alert.show(err);
    });
  }

}
