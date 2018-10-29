// @flow
import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { List, ListItem, Left, Body, Switch, Text, Button, Icon } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
const moment = require('moment');

import Lang from '../../../clypr-shared/services/lang';
import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles, Variables } from '../../../styles/global';
import { Loading } from '../../components/Loading';

type Props = {
  isLoading: boolean;
  hours: Models.ShopHours;
  onSave: (hours: Models.ShopHours) => void;
};

interface State {
  hours: Models.ShopHours;

  isDateTimePickerVisible?: boolean;
  editingDay?: Models.WeekDays;
  editingLabel?: string;
  editingIndex?: number;

  editingDate?: Date;
  editingMinimumDate?: ?Date;
  editingMaximumDate?: ?Date;
};

/** Implements this screen for Native platform. */
export class EditBarberScheduleScreen extends Component {

  state: State;
  props: Props;
  days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  defaultHour = { from: '09:00', to: '18:00', restricted: false };

  constructor(props: Props) {
    super(props);

    // Edit given props
    this.state = {
      hours: this.props.hours || {}
    };
  }

  render() {
    if (this.props.isLoading) { return <Loading />; }

    return (
      <ScrollView>
        <Text style={style.title}>{Lang('settings_edit_hours_tip')}</Text>

        <List>
          
          {this.days.map(weekDay => {
            // Get hours set for this weekday
            const hours = this.state.hours[weekDay];

            // Check if day has info set for it
            const isDayOpen = hours && hours.length > 0;
            
            return (
              <ListItem key={weekDay}>

                <Left style={style.selector}>
                  <Switch value={isDayOpen}
                          onValueChange={(val: boolean) => this.toggleDay(weekDay, val)} />
                </Left>

                <Body>

                  <View style={style.dayInfo}>
                    <Text style={style.weekday}>{Lang('weekdays_long_'+weekDay)}</Text>
                    <Text style={style.dayStatus}>{isDayOpen ? 'Open' : Lang('settings_edit_hours_closed')}</Text>
                  </View>
                
                {isDayOpen && (

                  <View>

                    {hours.map((hour, index) => {
                      // Choose style for this entry
                      const itemStyle = index < hours.length-1 ? style.hourEntry : style.hourEntryLast;

                      return (
                        <View key={index}>
                          {hour.restricted && <Text style={style.preferredLabel}>{Lang('settings_edit_hours_preferred')}</Text>}
                          <View style={itemStyle}>
                            
                            <View style={style.intervals}>
                              <TouchableOpacity style={style.timeButton} onPress={() => this.showDateTimePicker(weekDay, index, 'from')}>
                                <Text style={style.timeLabel}>{this.displayTime(hour.from)}</Text>
                              </TouchableOpacity>

                              <Text>{Lang('settings_edit_hours_to')}</Text>

                              <TouchableOpacity style={style.timeButton} onPress={() => this.showDateTimePicker(weekDay, index, 'to')}>
                                <Text style={style.timeLabel}>{this.displayTime(hour.to)}</Text>
                              </TouchableOpacity>
                            </View>

                            <View style={style.intervalActions}>
                              <Button onPress={() => this.toggleFavoriteEntry(weekDay, index)} small transparent
                                      style={style.intervalActionsButton}>
                                <Icon name="star" active={hour.restricted} style={style.intervalActionsButtonText} />
                              </Button>

                              <Button onPress={() => this.removeHourEntry(weekDay, index)} small transparent
                                      style={style.intervalActionsButton}>
                                <Icon name="trash" style={style.intervalActionsButtonText} />
                              </Button>
                            </View>
                          </View>
                        </View>
                      );
                    })}

                    <Button onPress={() => this.addHourEntry(weekDay)} transparent
                            style={style.addHourButton} >
                      <Text>{Lang('settings_edit_hours_addItem')}</Text>
                    </Button>
                  </View>

                )}
                </Body>

              </ListItem>
            );
          })}

        </List>

        <DateTimePicker
          mode="time"
          date={this.state.editingDate}
          minimumDate={this.state.editingMinimumDate}
          maximumDate={this.state.editingMaximumDate}
          titleIOS={Lang('settings_edit_hours_timePick')}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />

        <Button full
                style={Styles.submit}
                onPress={this.save}>
          <Text style={Styles.submitText}>{Lang('action_save')}</Text>
        </Button>
      </ScrollView>
    );
  }

  save = () => {
    // Build a hours object
    const hours: Models.ShopHours = {};
    this.days.forEach(day => hours[day] = this.state.hours[day] || []);

    this.props.onSave(hours);
  }

  displayTime(time: string): string {
    return moment(time, 'HH:mm').format('h:mm a');
  }

  toggleDay = (day: Models.WeekDays, val: boolean) => {
    this.setState((prev: State) => {
      const hours = prev.hours;

      if (hours[day] && hours[day].length > 0) {
        // Disable this day
        hours[day] = [];
      } else {
        // Enable this day with default hours
        hours[day] = [Object.assign({}, this.defaultHour)];
      }

      return prev;
    });
  };

  addHourEntry = (weekday: Models.WeekDays) => {
    // Add a new hour entry for this day
    this.setState((prev: State) => {
      // Start from previous interval ending
      const lastIndex = prev.hours[weekday].length - 1;
      const from = prev.hours[weekday][lastIndex].to;

      // Add some hours to make an end hour for this new interval
      const to = moment(from, 'HH:mm').add(4, 'hour').format('HH:mm');

      // Add interval
      prev.hours[weekday].push({ from, to, restricted: false });
      return prev;
    });
  }

  removeHourEntry = (weekday: Models.WeekDays, index: number) => {
    // Remove a interval from a day
    this.setState((prev: State) => {
      prev.hours[weekday].splice(index, 1)
      return prev;
    });
  }

  toggleFavoriteEntry = (weekday: Models.WeekDays, index: number) => {
    // Toggle restricted status on an hour interval for a day
    this.setState((prev: State) => {
      prev.hours[weekday][index].restricted = !prev.hours[weekday][index].restricted;
      return prev;
    });
  }

  showDateTimePicker = (day: Models.WeekDays, index: number, label: string) => {
    const editingRawDate = this.state.hours[day][index][label];
    const editingDate = editingRawDate && moment(editingRawDate, 'HH:mm').toDate();
    let editingMinimumDate = null;
    let editingMaximumDate = null;

    if (label === 'from') {
      // Restrict minimum hour if there is a previous interval
      if (index > 0) {
        // Restrict minimum hour to the end of previous interval
        const baseHour = this.state.hours[day][index-1].to;
        if (baseHour) { editingMinimumDate = moment(baseHour, 'HH:mm').toDate(); }
      }

      // Maximum hour is end of the interval
      const endHour = this.state.hours[day][index].to;
      editingMaximumDate = moment(endHour, 'HH:mm').subtract(1, 'minute').toDate();
    } else if (label === 'to') {
      // Minimum hour is start of the interval
      const startHour = this.state.hours[day][index].from;
      editingMinimumDate = moment(startHour, 'HH:mm').add(1, 'minute').toDate();

      // Restrict maximum hour if there is a next interval
      if (this.state.hours[day][index+1]) {
        // Restrict maximum hour to the start of next interval
        const baseHour = this.state.hours[day][index+1].from;
        if (baseHour) { editingMaximumDate = moment(baseHour, 'HH:mm').toDate(); }
      }
    }

    this.setState({
      editingDate,
      editingMinimumDate,
      editingMaximumDate,

      isDateTimePickerVisible: true,
      editingDay: day,
      editingLabel: label,
      editingIndex: index
    });
  }

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date: Date) => {
    this.hideDateTimePicker();

    // Update day
    if (date) {
      const dateValue = moment(date).format('HH:mm');

      // Apply change
      this.setState((prev: State) => {
        if (prev.editingDay &&
            prev.editingIndex !== undefined &&
            prev.editingLabel) {
          prev.hours[prev.editingDay][prev.editingIndex][prev.editingLabel] = dateValue;
        }

        return prev;
      });
    }
  };

}

const style = {

  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20
  },


  selector: {
    flex: 0,
    alignSelf: 'flex-start'
  },

  weekday: {
    fontSize: 18
  },

  dayStatus: {
    color: Variables.darkGrey
  },

  dayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },


  addHourButton: {
    alignSelf: 'flex-end',
    marginTop: 5
  },

  hourEntry: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomColor: Variables.nativeBaseFormFieldBorder,
    borderBottomWidth: 1
  },

  hourEntryLast: {},


  intervals: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  intervalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 3
  },

  intervalActionsButton: {
    margin: 0,
    paddingRight: 0
  },
  
  intervalActionsButtonText: {
    color: Variables.lightGrey
  },


  timeLabel: {
    width: 70,
    textAlign: 'right',
    marginLeft: 0,
    marginRight: 0
  },

  timeButton: {},

  preferredLabel: {
    fontSize: 12
  }
};

style.hourEntryLast = Object.assign({}, style.hourEntry, {
  borderBottomWidth: 0
});