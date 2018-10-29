// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native';

import { Route, RouteIcon } from './Route';
import Lang from '../clypr-shared/services/lang';

import { BarberSearchScreenContainer } from '../clypr-shared/containers/screens/barbers/BarberSearch';
import { BarberProfileScreenContainer } from '../clypr-shared/containers/screens/barbers/BarberProfile';
import { AppointmentCreateScreenContainer } from '../clypr-shared/containers/screens/appointments/AppointmentCreate';
import { BarberReviewCreateScreenContainer } from '../clypr-shared/containers/screens/barbers/BarberReviewCreate';
import { AppointmentDetailsScreenContainer } from '../clypr-shared/containers/screens/appointments/AppointmentDetails';

// Components exclusive to this platform
import { MediaView } from '../clypr-platform/screens/barbers/MediaView';

// Define screens, their required props from navigation state and navigation conigs such as title bars.
const routes = {
  Initial: {
    path: '/barbers',
    screen: Route(BarberSearchScreenContainer),
    navigationOptions: BarberSearchScreenContainer.navigationOptions
  },
  Profile: {
    path: '/barbers/:barberId',
    navigationOptions: { title: Lang('barber_profile_view_title') },
    screen: Route(BarberProfileScreenContainer, 'barberId')
  },
  Book: {
    path: '/barbers/:barberId/book',
    navigationOptions: { title: Lang('appointments_create_view_title') },
    screen: Route(AppointmentCreateScreenContainer, 'barberId',  'serviceId', 'rescheduleAppointmentId')
  },
  Review: {
    path: '/barbers/related/review',
    screen: Route(BarberReviewCreateScreenContainer, 'baseAppointment'),
    navigationOptions: { title: Lang('barber_review_view_title') },
  },
  Media: {
    path: '/media', screen: Route(MediaView, 'url'),
    navigationOptions: { title: Lang('mediaGallery_item_view_title') },
  },
  Appointment: {
    path: '/barbers/related/appointment',
    screen: Route(AppointmentDetailsScreenContainer, 'entry'),
    navigationOptions: { title: Lang('appointments_details_view_title_alt') },
  },
};

// Define settings for a navigator
const settings = {
  title: Lang('barbers_search_tab_title'),
  tabBarIcon: RouteIcon('ios-search')
};

/** A React-Navigation navigator with configured screens and settings. */
export const BarbersRoutes = StackNavigator(routes, { navigationOptions: settings });
