import React from 'react';
import { TabNavigator } from 'react-navigation';

import { NavigationService } from '../../services/navigator';
import { Variables } from '../../styles/global';

type Props = {
  tabs: Object;
};

/** Renders a tab bar for native app. */
export class TabBar extends React.Component {

  // Tab bar options
  config = {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    
    tabBarOptions: {
      activeTintColor: Variables.primaryColor,
      showLabel: false,
      showIcon: true
    }
  };

  navigator;
  constructor(props: Props) {
    super(props);
    
    // Create a router
    this.navigator = TabNavigator(this.props.tabs, this.config);

    // Sync navigation service with this router
    NavigationService.initializeNativeHistory(null, this.navigator.router);
  }

  render() {
    const TabBar = this.navigator;
    return <TabBar />
  }

};
