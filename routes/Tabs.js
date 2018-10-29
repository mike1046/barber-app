// @flow
/** This file contains objects to configure a React-Navigation TabNavigator. */

// Each tab will have its own router inside, usually a StackNavigator
import { SettingsRoutes } from './settings';
import { AppointmentsRoutes } from './appointments';
import { BarbersRoutes } from './barbers';
import { ClientsRoutes } from './clients';
import { RevenueRoutes } from './revenue';

// Tabs for users with 'client' role, with a dedicated router inside each one
export const ClientTabs = {
  BarbersTab: { screen: BarbersRoutes },
  AppointmentsTab: { screen: AppointmentsRoutes },
  SettingsTab: { screen: SettingsRoutes },
};

// Tabs for users with 'barber' role, with a dedicated router inside each one
export const BarberTabs = {
  AppointmentsTab: { screen: AppointmentsRoutes },
  RevenueTab: { screen: RevenueRoutes },
  ClientsTab: { screen: ClientsRoutes },
  SettingsTab: { screen: SettingsRoutes },
};
