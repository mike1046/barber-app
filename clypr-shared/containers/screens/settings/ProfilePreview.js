// @flow
import React, { Component } from 'react';

// Import component responsible for rendering this screen in the current platform
import { ProfilePreviewScreen } from '../../../../clypr-platform/screens/settings/ProfilePreview';

/** Manages shared logic for this screen. */
export class ProfilePreviewScreenContainer extends Component {

  render() {
    return (
      <ProfilePreviewScreen />
    );
  }

}
