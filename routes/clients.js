// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';

import { Route, RouteIcon } from './Route';
import Lang from '../clypr-shared/services/lang';

import { ClientsScreenContainer } from '../clypr-shared/containers/screens/clients/Clients';
import { ClientHistoryScreenContainer } from '../clypr-shared/containers/screens/clients/ClientHistory';
import { AppointmentDetailsScreenContainer } from '../clypr-shared/containers/screens/appointments/AppointmentDetails';

// Define screens, their required props from navigation state and navigation conigs such as title bars.
const routes = {
  List: { path: '/clients', screen: ClientsScreenContainer },
  Profile: {
    path: '/clients/:clientId',
    navigationOptions: {title: Lang('client_history_view_title')},
    screen: Route(ClientHistoryScreenContainer, 'clientId')
  },
  Appointment: {
    path: '/clients/:clientId/appointment',
    screen: Route(AppointmentDetailsScreenContainer, 'entry'),
    navigationOptions: { title: Lang('appointments_details_view_title_alt') },
  },
};

// Define settings for a navigator
const settings = {
  title: Lang('clients_tab_title'),
  tabBarIcon: RouteIcon('ios-people')
};

/** A React-Navigation navigator with configured screens and settings. */
export const ClientsRoutes = StackNavigator(routes, { navigationOptions: settings });
