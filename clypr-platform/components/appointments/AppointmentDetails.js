// @flow
import React, { Component } from 'react';
import { View, Text, Card, CardItem } from 'native-base';
const moment = require('moment');

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';

import { BarberAvatar } from '../barbers/profile/BarberAvatar';
import { AddressWithMap } from '../barbers/profile/AddressWithMap';
import { ServicesList } from '../barbers/profile/ServicesList';
import { PaymentsList } from '../payments/PaymentsList';
import { ReviewsList } from '../barbers/review/ReviewsList';

/** Render details for a selected appointment. */
export class AppointmentDetails extends Component {

  props: {
    entry: Models.Appointment;
    role: ?Models.UserRole;
  };

  render() {
    return (
      <View style={style.content}>
        {this.props.role === 'barber' ? this.renderDetailsForBarbers() : this.renderDetailsForClients()}
      </View>
    );
  }

  renderAvatarWithDate(appt: Models.Appointment) {
    // Use Models.User as if it was Models.Barber to extract avatar data
    const profile: any = appt.barber || appt.client;
    const date = moment(appt.date);

    return profile && (
      <View style={{...style.section, ...style.details}}>
        <BarberAvatar barber={profile} hideRating={this.props.role === 'barber'} />
        
        <View style={style.schedule}>
          <Text style={style.dateWeekday}>{ date.format('ddd') }</Text>
          <Text style={style.dateDay}>{ date.format('D') }</Text>
          <Text style={style.dateMonth}>{ date.format('MMMM') }</Text>
          <Text style={style.hours}>{ date.format('h:mm a') }</Text>
        </View>
      </View>
    );
  }

  renderServices(appt: Models.Appointment) {
    return appt.services && (
      <View style={style.section}>
        <Text style={style.subtitle}>{Lang('appointments_details_title_services')}</Text>
        <ServicesList services={appt.services} />
      </View>
    );
  }

  renderReview(appt: Models.Appointment) {
    return appt.review && (
      <View style={style.section}>
        <Text style={style.subtitle}>{Lang('appointments_details_title_review')}</Text>
        <ReviewsList entries={[appt.review]} />
      </View>
    );
  }

  renderBilling(appt: Models.Appointment) {
    return appt.billing && (
      <View style={style.section}>
        <Text style={style.subtitle}>{Lang('appointments_details_title_billing')}</Text>
        <Card>
          <CardItem style={style.billing}>
            {appt.billing && appt.billing.charges && appt.billing.charges.map((item, index) => (
              <View style={style.billingItem} key={index}>
                <Text style={style.billingCharge}>{item.label}</Text>
                <Text style={style.billingCharge}>${item.amount}</Text>
              </View>
            ))}

            {appt.billing.grandTotal && (
              <View style={style.billingItem}>
                <Text style={style.billingTotal}>Total</Text>
                <Text style={style.billingTotal}>${appt.billing.grandTotal}</Text>
              </View>
            )}
          </CardItem>
        </Card>
      </View>
    );
  }

  renderPayments(appt: Models.Appointment) {
    return appt.payments && appt.payments.length > 0 && (
      <View style={style.section}>
        <Text style={style.subtitle}>{Lang('appointments_details_title_payments')}</Text>
        <PaymentsList entries={appt.payments} itemStyle={style.paymentItem} />
      </View>
    );
  }

  renderMap(appt: Models.Appointment) {
    return (
      <View>
        {appt.barber &&
         appt.barber.shop &&
         appt.barber.shop.address && (
           <View style={style.section}>
            <AddressWithMap address={appt.barber.shop.address} />
          </View>
         )}
      </View>
    );
  }

  renderDetailsForBarbers() {
    const appt = this.props.entry;

    return (
      <View>
        {this.renderAvatarWithDate(appt)}
        {this.renderServices(appt)}
        {this.renderReview(appt)}
        {this.renderBilling(appt)}
        {this.renderPayments(appt)}
      </View>
    );
  }

  renderDetailsForClients() {
    const appt = this.props.entry;

    return (
      <View>
        {this.renderAvatarWithDate(appt)}
        {this.renderMap(appt)}
        {this.renderServices(appt)}
        {this.renderReview(appt)}
        {this.renderBilling(appt)}
        {this.renderPayments(appt)}
      </View>
    );
  }

}

const style = {
  content: {
    margin: 10
  },
  
  section: {
    marginVertical: 10
  },

  subtitle: {
    marginLeft: 5,
    color: Variables.nativeBaseFloatingFormFieldLabel
  },
  
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  schedule: {
    marginLeft: 10,
    justifyContent: 'center',
    backgroundColor: Variables.primaryLightColor,
    padding: 10,
    borderRadius: 5
  },

  dateWeekday: {
    fontSize: 14,
    textAlign: 'center',
    color: Variables.darkGrey
  },
  dateDay: {
    fontSize: 28,
    textAlign: 'center'
  },
  dateMonth: {
    fontSize: 14,
    textAlign: 'center',
    color: Variables.darkGrey
  },
  hours: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10
  },

  status: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20
  },
  cancelled: {},


  paymentItem: {
    backgroundColor: Variables.primaryLightColor
  },

  billing: {
    flexDirection: 'column',
    backgroundColor: Variables.primaryLightColor
  },
  billingItem: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  billingCharge: {
    fontSize: 14,
    marginBottom: 2
  },
  billingTotal: {
    fontSize: 16,
    marginTop: 5
  }
};

style.cancelled = Object.assign({}, style.status, {
  color: Variables.dangerColor
});
