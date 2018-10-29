// @flow
import React, { Component } from 'react';

import * as Models from '../../../models/dataModels';
import { ShopService } from '../../../services/shop';
import { NavigationService } from '../../../../services/navigator';
import { Alert } from '../../../../services/alert';

// Import component responsible for rendering this screen in the current platform
import { EditBarberScheduleScreen } from '../../../../clypr-platform/screens/settings/EditBarberSchedule';

type State = {
  isLoading: boolean;
};

type Props = {};

/** Manages shared logic for this screen. */
export class EditBarberScheduleScreenContainer extends Component {

  state: State = { isLoading: false };
  props: Props;
  hours: Models.ShopHours = {};
  days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  defaultDay = { from: '09:00', to: '18:00', restricted: false };

  constructor(props: Props) {
    super(props);

    // Build a default list of hours
    this.days.forEach(day => this.hours[day] = [Object.assign({}, this.defaultDay)]);
  }

  componentWillMount() {
    // Get initial data to be edited
    const barber = ShopService.getCurrentBarber();
    let hours: any = barber && barber.shop && barber.shop.hours;

    if (hours) {
      // Make a deep copy for editing
      const hoursCopy = {};

      Object.keys(hours).forEach((weekday: Models.WeekDays) => {
        const day = hours && hours[weekday];
        hoursCopy[weekday] = (day && day.map(aDay => Object.assign({}, aDay))) || [];
      });

      this.hours = hoursCopy;
    }
  }

  render() {
    // Get current shop hours
    const hours = this.hours;

    return (
      <EditBarberScheduleScreen
        onSave={this.save}
        hours={hours}
        isLoading={this.state.isLoading} />
    );
  }

  save = (hours: Models.ShopHours) => {
    this.setState({ isLoading: true });
    ShopService.updateHours(hours).then(() => {
      // Success
      NavigationService.goBack();
      this.setState({ isLoading: false });
    }).catch(err => {
      Alert.show(err);
      this.setState({ isLoading: false });
    })
  };

}
