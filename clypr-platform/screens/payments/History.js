// @flow
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Styles } from '../../../styles/global';
import { PaymentsList } from '../../components/payments/PaymentsList';
import { Loading } from '../../components/Loading';

type Props = {
  payments: Models.Payment[];
  isLoading: boolean;
  onSelect: (payment: Models.Payment) => void;
};

type State = {};

/** Implements this screen for Native platform. */
export class PaymentHistoryScreen extends Component {

  props: Props;
  state: State;

  render() {
    if (this.props.isLoading) { return <Loading />; }

    return (
      <View style={Styles.section}>

        {this.props.payments && this.props.payments.length > 0 ?
          <PaymentsList entries={this.props.payments} onSelect={this.props.onSelect} />
          :
          <Text style={Styles.title}>{Lang('payment_list_empty')}</Text>
        }

      </View>
    );
  }

}
