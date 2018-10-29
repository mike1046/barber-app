// @flow
import React, {Component} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Button, Icon, Left, List, ListItem, Right, Text} from 'native-base'
///
import {PayoutMethodService} from '../../../clypr-shared/services/payoutMethods';
import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import {Styles, Variables} from '../../../styles/global';
import {Loading} from '../../components/Loading';
import {BankAccount} from './BankAccount'

type State = {
  bankAccounts: Models.StripeBankAccount[];
  isLoading: boolean;
  showBankAccount: boolean; // show bank account screen
};

/** Implements this screen for Native platform. */
export class PayoutMethodsScreen extends Component {
  _observer;

  componentDidMount() {
    // Listen for all bank accounts
    this.setState({isLoading: true});

    this._observer = PayoutMethodService.observeAllBankAccounts(bankAccounts => {
      this.setState({bankAccounts, isLoading: false});
    });
  }

  componentWillUnmount() {
    if (this._observer) {
      this._observer.unsubscribe();
    }
  }

  setDefaultBankAccount = (account) => {
    this.setState({isLoading: true});
    return PayoutMethodService.setDefaultBankAccount(account).then(() => {
      this.setState({isLoading: false});
    }).catch((err) => {
      console.log('default error: ', err)
      this.setState({isLoading: false});
    })
  }

  removeBankAccount = (account) => {
    this.setState({isLoading: true});
    return PayoutMethodService.removeBankAccount(account).then(() => {
      this.setState({isLoading: false});
    }).catch((err) => {
      console.log('remove error: ', err)
      this.setState({isLoading: false});
    })
  }

  addBankAccount = (params: Models.BankAccountDetails) => {
    this.setState({isLoading: true, showBankAccount: false});

    PayoutMethodService.addBankAccount(params).then(() => {
      this.setState({isLoading: false});
    }).catch((err) => {
      console.log('add error: ', err)
      this.setState({isLoading: false});
    })
  }

  state: State = {
    bankAccounts: [],
    isLoading: false,
    showBankAccount: false
  };

  render() {
    if (this.state.isLoading) {
      return <Loading/>;
    }

    return (
      <View>
        <FlatList data={this.state.bankAccounts}
                  style={{backgroundColor: 'white'}}
                  keyExtractor={this._keyExtractor}
                  renderItem={({item}) => this.renderBankAccount(item)}
                  refreshing={this.state.isLoading}
                  ListEmptyComponent={<Text style={Styles.title}>{Lang('bank_account_list_empty')}</Text>}/>
        <Button full
                disabled={this.state.isLoading}
                style={Styles.submit}
                onPress={() => {
                  this.setState({showBankAccount: true})
                }}>
          <Text style={Styles.submitText}>{Lang('action_add_bank_account')}</Text>
        </Button>
        <BankAccount visible={this.state.showBankAccount} onCancel={() => this.setState({showBankAccount: false})}
                     onAccept={this.addBankAccount}/>
      </View>
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderBankAccount = (account: Models.StripeBankAccount) => {
    return (<ListItem icon>
      <Body>
      <Text>{Lang('bank_account_last4').replace('__LAST4__', account.last4)}</Text>
      </Body>
      <Right>
        {account.default_for_currency === true && <Text>Default</Text>}
        {account.default_for_currency === false &&
        <TouchableOpacity onPress={this.setDefaultBankAccount.bind(this, account)}>
          <Text style={{color: Variables.nativeBasePrimaryColor}}>Set Default</Text>
        </TouchableOpacity>}
        <Button transparent onPress={this.removeBankAccount.bind(this, account)}>
          <Icon name={'remove-circle'}/>
        </Button>
      </Right>
    </ListItem>)
  }

}
