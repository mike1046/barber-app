// @flow
import React from 'react';
import {StackNavigator} from 'react-navigation';

import {Route, RouteIcon} from './Route';
import Lang from '../clypr-shared/services/lang';

import {SettingsScreenContainer} from '../clypr-shared/containers/screens/settings/Settings';
import {EditProfileScreenContainer} from '../clypr-shared/containers/screens/settings/EditProfile';
import {EditCredentialsScreenContainer} from '../clypr-shared/containers/screens/settings/EditCredentials';
import {DeleteAccountScreenContainer} from '../clypr-shared/containers/screens/settings/DeleteAccount';
import {EditAddressScreenContainer} from '../clypr-shared/containers/screens/settings/EditAddress';
import {EditGalleryScreenContainer} from '../clypr-shared/containers/screens/settings/EditGallery';
import {EditBarberScheduleScreenContainer} from '../clypr-shared/containers/screens/settings/EditBarberSchedule';
import {EditBarberServicesScreenContainer} from '../clypr-shared/containers/screens/settings/EditBarberServices';
import {ProfilePreviewScreenContainer} from '../clypr-shared/containers/screens/settings/ProfilePreview';
import {ContactScreenContainer} from '../clypr-shared/containers/screens/settings/Contact';
import {PaymentHistoryScreenContainer} from '../clypr-shared/containers/screens/payments/History';
import {PaymentMethodsScreenContainer} from '../clypr-shared/containers/screens/payments/Methods';
import {AppointmentDetailsScreenContainer} from '../clypr-shared/containers/screens/appointments/AppointmentDetails';
// Components exclusive to this platform
import {EditBarberServiceItemScreen} from '../clypr-platform/screens/settings/EditBarberServiceItem';
import {PayoutMethodsScreenContainer} from "../clypr-shared/containers/screens/payments/PayoutMethods";

// Define screens, their required props from navigation state and navigation configs such as title bars.
const routes = {
  List: {
    path: '/settings',
    screen: Route(SettingsScreenContainer)
  },

  Profile: {
    path: '/settings/profile',
    screen: Route(EditProfileScreenContainer),
    navigationOptions: {title: Lang('settings_edit_profile_title')}
  },

  Preview: {
    path: '/settings/profile/preview',
    screen: Route(ProfilePreviewScreenContainer),
    navigationOptions: {title: Lang('settings_edit_preview')}
  },

  Address: {
    path: '/settings/address',
    screen: Route(EditAddressScreenContainer),
    navigationOptions: {title: Lang('settings_edit_address_title')}
  },

  Gallery: {
    path: '/settings/gallery',
    screen: Route(EditGalleryScreenContainer),
    navigationOptions: {title: Lang('settings_edit_gallery')}
  },

  Schedule: {
    path: '/settings/schedule',
    screen: Route(EditBarberScheduleScreenContainer),
    navigationOptions: {title: Lang('settings_edit_hours_title')}
  },

  Services: {
    path: '/settings/services',
    screen: Route(EditBarberServicesScreenContainer),
    navigationOptions: {title: Lang('settings_edit_services')}
  },

  ServiceEdit: {
    path: '/settings/services/edit',
    screen: Route(EditBarberServiceItemScreen, 'entry'),
    navigationOptions: {title: Lang('settings_edit_services_title')}
  },

  Password: {
    path: '/settings/password',
    screen: Route(EditCredentialsScreenContainer),
    navigationOptions: {title: Lang('settings_edit_password')}
  },

  DeleteAccount: {
    path: '/settings/delete',
    screen: Route(DeleteAccountScreenContainer),
    navigationOptions: {title: Lang('settings_deleteAccount_button')}
  },

  Cards: {
    path: '/settings/cards',
    screen: Route(PaymentMethodsScreenContainer),
    navigationOptions: {title: Lang('settings_edit_cards')}
  },

  PayoutMethods: {
    path: '/settings/payout/methods',
    screen: Route(PayoutMethodsScreenContainer),
    navigationOptions: {title: Lang('settings_edit_payout_methods')}
  },

  Payments: {
    path: '/settings/payments',
    screen: Route(PaymentHistoryScreenContainer),
    navigationOptions: {title: Lang('settings_edit_payments')}
  },

  AppointmentDetails: {
    path: '/settings/related/appointments/details',
    screen: Route(AppointmentDetailsScreenContainer, 'entry', 'disableActions'),
    navigationOptions: {title: Lang('appointments_details_view_title_alt')},
  },

  Contact: {
    path: '/settings/contact',
    screen: Route(ContactScreenContainer),
    navigationOptions: {title: Lang('settings_contact_view_title')}
  }
};

// Define settings for a navigator
const settings = {
  title: Lang('settings_tab_title'),
  tabBarIcon: RouteIcon('ios-settings'),
};

/** A React-Navigation navigator with configured screens and settings. */
export const SettingsRoutes = StackNavigator(routes, {navigationOptions: settings});
