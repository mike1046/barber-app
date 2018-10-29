// @flow
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NavigationNavigatorProps } from 'react-navigation/src/TypeDefinition';

import { NavigationService } from '../services/navigator';
import { Variables } from '../styles/global';

/** Generate a screen for a React-Navigation Navigator, so instead of the navigator
 * passing its props straight to each screen component (which is shared with a web version using another
 * navigation library), it will pass navigation props to this generated component, which will handle
 * navigation methods such as "go back" and pass only the props the screen needs.
 */
export function Route(Screen: any, ...params: string[]) {
  // Generate a component which will receive the React-Navigation props for rendered screens.
  return (props: any) => {
    // Extract some props from react-navigation
    const { navigation } = props;

    // Notify navigation service, which will handle cross-platform nav operations
    if (navigation) { NavigationService.initializeNativeHistory(navigation, null); }

    // Collect navigation state which are the props required by the screen component
    const navigationState = navigation && navigation.state && navigation.state.params;
    const screenProps = {};

    // Collect all params requested for this screen
    params.forEach(key => {
      // Check if react-navigation state has this param
      const val = navigationState && navigationState[key];

      // Use it as a screen prop
      if (val) { screenProps[key] = val; }
    });

    // Render the real screen only with its required props
    return <Screen {...screenProps} />;
  };
}

/** Generate icon for tabs in a React-Navigation TabNavigator. */
export function RouteIcon(iconName: string) {
  return ({ tintColor }: { tintColor: string }) => (
    <Ionicons name={iconName}
              size={Variables.TabBarIconSize}
              color={tintColor} />
  );
}