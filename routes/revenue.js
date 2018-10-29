// @flow
import React from 'react';
import {Button, Icon} from 'native-base'
import {StackNavigator} from 'react-navigation';

import {RouteIcon} from './Route';
import Lang from '../clypr-shared/services/lang';

import {RevenueScreenContainer} from '../clypr-shared/containers/screens/revenue/Revenue';

// Define screens, their required props from navigation state and navigation configs such as title bars.
const routes = {
  Overview: {path: '/revenue', screen: RevenueScreenContainer},
};

// Define settings for a navigator
const settings = {
  title: Lang('revenue_tab_title'),
  tabBarIcon: RouteIcon('ios-cash'),
};

/** A React-Navigation navigator with configured screens and settings. */
export const RevenueRoutes = StackNavigator(routes, {navigationOptions: settings});
