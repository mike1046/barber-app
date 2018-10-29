// @flow
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Button } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Alert } from '../../../services/alert';
import { Styles, Variables } from '../../../styles/global';
import type { AppointmentOptions } from '../../../clypr-shared/services/appointments';
import { ShopService, type AvailableHours } from '../../../clypr-shared/services/shop';
import { SchedulePicker } from './schedule/SchedulePicker';

type Props = {
  barberId: string;
  serviceId?: ?string;
  services: Models.BarberService[];
  onSubmit?: (options: AppointmentOptions) => void;
  onChange: (options: ?AppointmentOptions, scroll?: boolean) => void;
};

type State = {
  activeServiceId: string;
  activeDate: Date;
  activeTime: string;
  showServices: boolean;

  isLoadingAvailability: boolean;
  availability?: AvailableHours;
};

/** Render a form to collection information to create an appointment. */
export class AppointmentCreateForm extends Component {

  props: Props;
  state: State;
  
  constructor(props: Props) {
    super(props);

    this.state = {
      activeServiceId: this.props.serviceId || '',
      activeDate: new Date(),
      activeTime: '',
      showServices: this.props.serviceId ? false : true,
      isLoadingAvailability: false
    };
  }

  componentDidMount() {
    this.getBarberAvailability();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Update availability if barber changed
    if (prevProps.barberId !== this.props.barberId) { this.getBarberAvailability(); }
  }

  getBarberAvailability() {
    this.setState({ isLoadingAvailability: true });
    
    // Load available barber hours
    ShopService.getAvailableHours(this.props.barberId).then(availability => {
      this.setState({ availability, isLoadingAvailability: false });
    }).catch(err => {
      this.setState({ isLoadingAvailability: false });
      Alert.show(Lang('appointments_create_hours_error1') + ': ' + err);
    });
  }

  render() {
    let services = this.props.services;
    const activeIsoDate = moment(this.state.activeDate).format('YYYY-MM-DD');
    const hours = this.state.availability && this.state.availability[activeIsoDate];

    let unavailableDays = []
    if (this.state.availability) {
      // Check which days do not have availability
      unavailableDays = Object.keys(this.state.availability).filter(day => {
        // Choose this day if it has no hours available
        return this.state.availability && this.state.availability[day].length === 0;
      });
    }

    // Maybe show only active service
    if (!this.state.showServices) { services = services.filter(s => s.id === this.state.activeServiceId); }

    return (
      <View style={Styles.section}>

        <Text style={style.subtitleFirst}>1. {Lang('appointments_create_title_service')}</Text>

        {services.map(service => (
          <TouchableOpacity onPress={() => { this.selectService(service.id); }} key={service.id}>
            <View style={this.state.activeServiceId === service.id ? style.selectedService : style.service}>
              <Text style={style.label}>{ service.label }</Text>
              <Text style={style.desc}>{ service.desc }</Text>

              <View style={style.details}>
                <Text style={style.price}>${ service.price }</Text>
                <Text style={style.duration}>{ service.durationInMinutes } {Lang('time_minutes')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {!services || services.length === 0 && (<Text>{Lang('appointments_create_services_empty')}</Text>)}

        {!this.state.showServices && (
          <Button transparent block onPress={() => {
            this.setState({ showServices: true });
          }}><Text>{Lang('appointments_create_services_all')}</Text></Button>
        )}

        <Text style={style.subtitle}>2. {Lang('appointments_create_title_hour')}</Text>
        <SchedulePicker
          onSelect={this.selectDate}
          activeDate={this.state.activeDate}
          disabledDates={unavailableDays} />

        <View style={style.timePicker}>
          {this.state.isLoadingAvailability && <Text style={style.empty}>{Lang('appointments_create_hours_loading')}</Text>}
          {!this.state.isLoadingAvailability && (!hours || hours.length === 0) && <Text style={style.empty}>{Lang('appointments_create_hours_empty')}</Text>}
          
          {!this.state.isLoadingAvailability && hours && (
            hours.map(hour => (
              <TouchableOpacity onPress={() => { this.selectTime(hour.value); }} key={hour.value}
                                style={this.state.activeTime === hour.value ? style.timeSlotActive : style.timeSlot}>
                <Text style={style.timeSlotText}>{hour.label}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    );
  }

  changed = (scroll?: boolean = false) => {
    setTimeout(() => {
      const appt = this.getAppointmentObject();
      if (this.props.onChange) { this.props.onChange(appt, scroll); }
    }, 100);
  }

  selectService(activeServiceId: string) {
    this.setState({ activeServiceId, showServices: false });
    this.changed(true);
  }

  selectDate = (activeDate: Date) => {
    this.setState({ activeDate });
    this.changed();
  }

  selectTime = (activeTime: string) => {
    this.setState({ activeTime });
    this.changed();
  }

  getAppointmentObject: () => ?AppointmentOptions = () => {
    // Create options object
    if (this.state.activeServiceId &&
        this.state.activeTime &&
        this.state.activeDate) {
      // Get active service
      const serviceIds = [this.state.activeServiceId];

      // Get date and time object
      const hourAndMinute = this.state.activeTime.split(':');
      const aDate = this.state.activeDate;
      
      const date = {
        year: aDate.getFullYear(),
        month: aDate.getMonth() + 1,
        day: aDate.getDate(),
        hour: Number(hourAndMinute[0] || 0),
        minute: Number(hourAndMinute[1] || 0)
      };

      // Create options object
      return {
        date,
        serviceIds,
        barberId: this.props.barberId,
        urgent: false
      };
    } else { return null; }
  }

}


const style: any = {

  subtitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20
  },

  service: {
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },

  label: {
    fontSize: 16
  },

  desc: {
    fontSize: 14,
    color: Variables.grey,
    marginBottom: 5
  },

  details: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  price: {
    fontWeight: 'bold',
    marginRight: 20
  },

  duration: {
    fontSize: 14,
    color: Variables.grey
  },

  timePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  timeSlot: {
    padding: 10,
    borderRadius: 4,
    flexBasis: 100,
    flexGrow: 1
  },

  timeSlotText: {
    textAlign: 'center'
  },

  empty: {
    flex: 1,
    textAlign: 'center',
    margin: 20
  }

};

style.subtitleFirst = Object.assign({}, style.subtitle, { marginTop: 0 });
style.selectedService = Object.assign({}, style.service, { backgroundColor: Variables.primaryLightColor });
style.timeSlotActive = Object.assign({}, style.timeSlot, { backgroundColor: Variables.primaryLightColor });
