// @flow
import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {Body, Button, Icon, Left, List, ListItem, Right, Text} from 'native-base'

import {Styles} from '../../../styles/global';
import {BalanceService} from '../../../clypr-shared/services/balance';
import * as Models from "../../../clypr-shared/models/dataModels";
import Lang from "../../../clypr-shared/services/lang";
import {Loading} from '../../components/Loading';
import moment from 'moment';
import {DatabaseService} from "../../../clypr-shared/services/database";
import {AccountService} from "../../../clypr-shared/services/account";
import {Variables} from '../../../styles/global';
import {Browser} from '../../components/Browser';
import {PayoutMethodService} from '../../../clypr-shared/services/payoutMethods';

type State = {
  balance: ?Models.StripeBalance;
  isLoading: boolean;
  transactions: Models.StripeTransaction[];
  barberTimezone: string;
  browserVisible: boolean;
  uri: string;
  title: string;
};

/** Implements Revenue screen for Native platform. */
export class RevenueScreen extends Component {

  componentDidMount() {
    this.onRefresh()
  }

  state: State = {
    balance: null,
    isLoading: false,
    transactions: [],
    barberTimezone: 'US/Eastern',
    browserVisible: false,
    uri: '',
    title: '',
  };

  onRefresh = () => {
    this.setState({isLoading: true});

    const user = AccountService.getCurrentUser();
    DatabaseService.getDocumentByPath('barber/' + user.id).then((barber: Models.Barber) => {
      const barberTimezone = (barber && barber.shop && barber.shop.address && barber.shop.address.timezone) || 'US/Eastern';
      this.setState({barberTimezone})

      BalanceService.getBalance().then(balance => {
        this.setState({balance});
        BalanceService.getTransactions({}).then(transactions => {
          this.setState({transactions, isLoading: false});
        })
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Loading/>;
    }

    return (<View style={{flex: 1}}>
      <Button
        full
        style={Styles.submit}
        onPress={this.openAccount}>
        <Text style={Styles.submitText}>{Lang('revenue_open_account')}</Text>
      </Button>
      {this.state.balance && <View>
        <ListItem itemHeader first>
          <Body>
          <Text>{Lang('pending_list_heading')}</Text>
          </Body>
          <Right>
            <Button onPress={this.onRefresh} light style={{paddingHorizontal: 10}}><Icon name='refresh'/></Button>
          </Right>
        </ListItem>
        <FlatList data={this.state.balance.pending}
                  style={{backgroundColor: 'white'}}
                  keyExtractor={this._balanceKeyExtractor}
                  renderItem={({item}) => this.renderBalance(item)}
                  ListEmptyComponent={<Text style={Styles.title}>{Lang('pending_balance_list_empty')}</Text>}/>
        <ListItem itemHeader>
          <Body>
          <Text>{Lang('available_list_heading')}</Text>
          </Body>
          <Right>
            <Button onPress={this.onRefresh} light style={{paddingHorizontal: 10}}><Icon name='refresh'/></Button>
          </Right>
        </ListItem>
        <FlatList data={this.state.balance.available}
                  style={{backgroundColor: 'white'}}
                  keyExtractor={this._balanceKeyExtractor}
                  renderItem={({item}) => this.renderBalance(item)}
                  ListEmptyComponent={<Text style={Styles.title}>{Lang('available_balance_list_empty')}</Text>}/>
        <ListItem itemHeader>
          <Text>{Lang('transactions_heading')}</Text>
        </ListItem>
        <FlatList data={this.state.transactions}
                  style={{backgroundColor: 'white', height: '100%'}}
                  keyExtractor={this._transactionKeyExtractor}
                  renderItem={({item}) => this.renderTransaction(item)}
                  ListEmptyComponent={<Text style={Styles.title}>{Lang('transactions_list_empty')}</Text>}/>

      </View>}
      <Browser visible={this.state.browserVisible} uri={this.state.uri} title={this.state.title} onClose={this.onBrowserClose}/>
    </View>);
  }

  openAccount = async () => {
    const data = await PayoutMethodService.getLoginUrl();
    this.setState({browserVisible: true, uri: data.url, title: Lang('revenue_account_title')})

  }

  _balanceKeyExtractor = (item, index) => index;
  _transactionKeyExtractor = (item) => item.id;

  renderBalance = (balance: Models.StripeBalanceTransaction) => {
    return (<ListItem icon>
      <Body>
      <Text>{Lang('balance_row_text').replace('__AMOUNT__', Math.round(balance.amount / 100)).replace('__CURRENCY__', balance.currency.toUpperCase())}</Text>
      </Body>
    </ListItem>)
  }

  getTransactionIcon = (transaction: Models.StripeTransaction) => {
    let iconName = 'ios-cash-outline'
    switch (transaction.type) {
      case 'refund':
      case 'payment_refund':
      case 'application_fee_refund':
      case 'payment_failure_refund':
      case 'transfer_refund':
        iconName = 'ios-arrow-round-back-outline'
        break;
      case 'charge':
      case 'payment':
      case 'application_fee':
      case 'adjustment':
      case 'payout':
        iconName = 'ios-cash-outline'
        break;
      case 'transfer':
        iconName = 'ios-arrow-round-forward-outline'
        break;
      case 'payout_cancel':
        iconName = 'ios-close-outline'
        break;
      case 'payout_failure':
        iconName = 'ios-thumbs-down-outline'
        break;
      case 'validation':
        iconName = 'ios-checkmark-circle-outline'
        break;
      case 'stripe_fee':
      default:
        iconName = 'ios-cash-outline'
    }
    return iconName
  }

  renderTransaction = (transaction: Models.StripeTransaction) => {
    const transactionTime = moment.unix(transaction.created)
    transactionTime.tz(this.state.barberTimezone)

    const iconName = this.getTransactionIcon(transaction)

    return (<ListItem icon style={{backgroundColor: transaction.status === 'available' ? Variables.backgroundGrey : Variables.disabledGrey}}>
      <Left>
        <Icon name={iconName}/>
      </Left>
      <Body>
      <Text>{Lang('transaction_row_text').replace('__AMOUNT__', Math.round(transaction.amount / 100)).replace('__CURRENCY__', transaction.currency.toUpperCase())}</Text>
      <Text note>{Lang('transaction_date').replace('__DATE__', transactionTime.format('MM-DD-YYYY'))}</Text>
      </Body>
      <Right>
        <Text style={{marginHorizontal: 5}} note>{transactionTime.format('h:mm a')}</Text>
      </Right>
    </ListItem>)
  }

  onBrowserClose = () => {
    this.setState({browserVisible: false})
  }

}
