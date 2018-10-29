// @flow
import React, { PureComponent } from 'react';
import { TouchableOpacity, View, ScrollView, Text, Dimensions } from 'react-native';
const moment = require('moment');

import { Utilities } from '../../../../clypr-shared/services/utilities';
import { Variables } from '../../../../styles/global';

type Props = {
  activeDate: Date;
  enablePastDates?: boolean;
  datesWithBadges?: {[isoDate: string]: number};
  onSelect: (date: Date) => void;
  disabledDates?: string[]; // yyyy-mm-dd for days which can not be picked
};

/** Render a list of dates to be picked. */
export class SchedulePicker extends PureComponent {

  props: Props;

  render() {
    const { width } = Dimensions.get('window');

    return (
      <ScrollView
        horizontal={true}
        style={style.picker}
        contentOffset={this.props.enablePastDates && { x: width/2, y: 0 }}>

        {this.getAllDates().map(aDateInfo => {
          const date = moment(aDateInfo.date);

          const isActive = date.date() == (this.props.activeDate && moment(this.props.activeDate).date());
          let itemStyle = isActive ? style.activeDate : style.date;

          const isDisabled = this.props.disabledDates && this.props.disabledDates.includes(aDateInfo.date);
          if (isDisabled) { itemStyle = style.disabledDate; }

          // Check if date has badge
          let hasBadge = false;
          if (this.props.datesWithBadges &&
              this.props.datesWithBadges[aDateInfo.date]) {
            // There are appointments on this day
            hasBadge = true;
          }

          // Change style if day has no appointments
          if (this.props.datesWithBadges && !hasBadge && !isActive) { itemStyle = style.disabledDate; }
          
          // Mark if is today
          if (aDateInfo.isToday) {
            itemStyle = Object.assign({}, style.today, itemStyle);
          }

          return (
            <TouchableOpacity
              disabled={isDisabled}
              style={{height:80}}
              key={date.toISOString()}
              onPress={() => { this.select(date.toDate()); }}>
              <View style={itemStyle}>
                <Text style={style.weekday}>{ date.format('ddd') }</Text>
                <Text style={style.day}>{ date.format('D') }</Text>
                <Text style={style.month}>{ date.format('MMM') }</Text>
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    );
  }

  getAllDates() {
    return Utilities.getDatesAroundToday(this.props.enablePastDates ? 7 : 0, 15);
  }

  select = (date: Date) => {
    if (date && this.props.onSelect) {
      this.props.onSelect(date);
    }
  }

}

const style = {

  picker: {
    flex: 1,
    height: '100%'
  },

  date: {
    padding: 10,
    borderRadius: 2,
    height: '100%'
  },

  weekday: {
    flex: 1,
    textAlign: 'center'
  },

  day: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18
  },

  month: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: Variables.lightGrey,
    marginTop: 2
  },

  activeDate: {},
  disabledDate: {},
  today: {
    backgroundColor: Variables.primaryDarkColor
  }

};

style.activeDate = Object.assign({}, style.date, { backgroundColor: Variables.primaryLightColor });
style.disabledDate = Object.assign({}, style.date, { opacity: 0.4 });
