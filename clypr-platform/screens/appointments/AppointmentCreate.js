// @flow
import React, {Component} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {Button, Text} from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import {Styles} from '../../../styles/global';
import type {AppointmentOptions, ReservationCost} from '../../../clypr-shared/services/appointments';
import {AppointmentsService} from '../../../clypr-shared/services/appointments';
import {AppointmentCreateForm} from '../../components/appointments/AppointmentCreateForm';
import {Loading} from '../../components/Loading';
import {PaymentMethodService} from '../../../clypr-shared/services/paymentMethods';
import { NavigationService } from '../../../services/navigator';
import { Alert } from '../../../services/alert';

type Props = {
  onCreate: (options: AppointmentOptions, predictedAmount: number) => void;
  barberId: string;
  serviceId?: ?string;
  services: Models.BarberService[];
  extraFees?: { label: string, amount: number }[];
  isRescheduling?: boolean;
  isLoading: boolean;
};

type State = {
  cost: ReservationCost;
  canSubmit: boolean;
  defaultSource: ?Models.StripeCard;
};

/** Implements Appointment Create screen for Web platform. */
export class AppointmentCreateScreen extends Component {

  currentOptions: ?AppointmentOptions;
  _scroll;
  _defaultPaymentSourceObserver;

  props: Props;
  state: State = {
    cost: {subTotal: 0, fees: [], total: 0},
    canSubmit: false,
    defaultSource: null
  };

  componentDidMount() {
    this._defaultPaymentSourceObserver = PaymentMethodService.observeAllSources(() => {
      this.setState({defaultSource: PaymentMethodService.getDefaultSource()})
    });
  }

  componentWillUnmount() {
    if (this._defaultPaymentSourceObserver) {
      this._defaultPaymentSourceObserver.unsubscribe();
    }
  }

  render() {
    if (this.props.isLoading) {
      return <Loading/>;
    }

    return (
      <View style={style.container}>
        <ScrollView style={style.content} ref={comp => this._scroll = comp}>
          <AppointmentCreateForm
            barberId={this.props.barberId}
            serviceId={this.props.serviceId}
            services={this.props.services}
            onChange={this.update}/>
        </ScrollView>

        <View style={{...Styles.subFooter, ...style.footer}}>

          {this.state.defaultSource &&
          <View style={{width: 75, marginLeft: 10, alignItems: 'center'}}>
            <Image style={style.paymentMethodIcon} source={this.state.defaultSource.brandImage}/>
            <Text style={style.last4}>{this.state.defaultSource.last4}</Text>
          </View>}

          <View style={style.amount}>
            <View style={style.billingItem}>
              <Text style={style.price}>${this.state.cost.subTotal}</Text>
              <Text style={style.priceLabel}>{Lang('appointments_create_priceItems_service')}</Text>
            </View>

            {this.state.cost.fees.map((fee, index) => (
              <View key={index} style={style.billingItem}>
                <Text style={style.price}>${fee.amount}</Text>
                <Text style={style.priceLabel}>{fee.label}</Text>
              </View>
            ))}
          </View>

          <Button
            rounded
            small
            style={style.confirm}
            onPress={this.create}
            disabled={!this.state.canSubmit}>
            <Text style={style.confirmAmount}>{`$${this.state.cost.total}`}</Text>
            <Text
              style={style.confirmText}>{this.props.isRescheduling ? Lang('appointments_actions_reschedule') : Lang('appointments_actions_book')}</Text>
          </Button>

        </View>

      </View>
    );
  }

  update = (options: ?AppointmentOptions, scroll?: boolean) => {
    this.currentOptions = options;

    // Scroll to top
    if (scroll && this._scroll) {
      this._scroll.scrollTo({x: 0, y: 0, animated: true});
    }

    // Calculate due amount
    if (options && options.serviceIds) {
      // Get services full information
      const services: Models.BarberService[] = [];
      options.serviceIds.forEach(id => {
        const info = this.props.services.find(s => s.id === id);
        if (info) {
          services.push(info);
        }
      });

      // Calculate amount
      const cost = AppointmentsService.calculateReservationAmount(services, this.props.extraFees);
      if (cost && cost.total >= 0) {
        // Check if appointment can be submitted already
        const canSubmit = options.date && cost.total > 0 && options.serviceIds.length > 0;

        this.setState({cost, canSubmit});
      } else {
        // Appointment is not ready yet
        this.setState({canSubmit: false});
      }
    } else {
      // Appointment is not ready yet
      this.setState({canSubmit: false});
    }
  };

  create = () => {
    if(!this.state.defaultSource){
      Alert.confirm(
        Lang('appointment_action_no_payment_source_title'),
        Lang('appointment_action_no_payment_source_desc'),
        Lang('appointment_action_no_payment_source_cancel'),
        Lang('appointment_action_no_payment_source_confirm'),
        null,
        () => {
          NavigationService.goToRoute('Cards');
        }
      );
    }
    else{
      this.props.onCreate(this.currentOptions, this.state.cost.total);
    }
  };

}

const style = {

  container: {
    flex: 1
  },

  content: {
    flex: 1
  },

  footer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },


  amount: {
    flex: 0,
    marginRight: 15,
  },

  billingItem: {
    flexDirection: 'row',
    marginBottom: 2
  },

  price: {
    fontSize: 14,
    width: 35,
    textAlign: 'right',
    marginRight: 5
  },

  priceLabel: {
    fontSize: 14
  },

  subtotal: {
    fontSize: 18
  },

  fees: {
    fontSize: 14
  },

  confirm: {
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 10
  },

  confirmText: {
    color: 'white'
  },

  confirmAmount: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5
  },

  paymentMethodIcon: {
    height: 26,
    width: 42,
    resizeMode: 'contain'
  },

  last4: {
    fontSize: 14
  }

};
