// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';

import { Route, RouteIcon } from './Route';
import Lang from '../clypr-shared/services/lang';

import { AppointmentsListScreenContainer } from '../clypr-shared/containers/screens/appointments/AppointmentsList';
import { AppointmentDetailsScreenContainer } from '../clypr-shared/containers/screens/appointments/AppointmentDetails';
import { BarberReviewCreateScreenContainer } from '../clypr-shared/containers/screens/barbers/BarberReviewCreate';
import { AppointmentCreateScreenContainer } from '../clypr-shared/containers/screens/appointments/AppointmentCreate';

// Define screens, their required props from navigation state and navigation conigs such as title bars.
const routes = {
  Initial: { path: '/appointments', screen: Route(AppointmentsListScreenContainer) },
  Appointment: {
    path: '/appointments/details',
    screen: Route(AppointmentDetailsScreenContainer, 'entry'),
    navigationOptions: { title: Lang('appointments_details_view_title') },
  },
  Review: {
    path: '/appointments/review',
    screen: Route(BarberReviewCreateScreenContainer, 'baseAppointment'),
    navigationOptions: { title: Lang('barber_review_view_title') },
  },
  Book: {
    path: '/appointments/related/book/:barberId',
    navigationOptions: { title: Lang('appointments_create_view_title') },
    screen: Route(AppointmentCreateScreenContainer, 'barberId',  'serviceId', 'rescheduleAppointmentId')
  },
};

// Define settings for a navigator
const settings = {
  title: Lang('appointments_tab_title'),
  tabBarIcon: RouteIcon('ios-calendar'),
};

/** A React-Navigation navigator with configured screens and settings. */
export const AppointmentsRoutes = StackNavigator(routes, { navigationOptions: settings });
