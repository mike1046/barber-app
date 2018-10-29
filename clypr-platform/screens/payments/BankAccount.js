// @flow
import React, {Component} from 'react'
import {Modal} from 'react-native'
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Left,
  Right,
  Text,
  Title
} from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';

type BankAccountDetailsValidation = {
  accountNumber: ?string;
  countryCode: ?string;
  currency: ?string;
  routingNumber: ?string;
  accountHolderName: ?string;
  accountHolderType: ?string;
}

type State = {
  form: Models.BankAccountDetails,
  validationErrors: BankAccountDetailsValidation,
  keyboardHeight: number;
}

type Props = {
  visible: boolean;
  onCancel: () => void;
  onAccept: (form: Models.BankAccountDetails) => void;
}

export class BankAccount extends Component {

  props: Props;
  state: State = {
    form: {
      accountNumber: '000123456789',
      countryCode: 'US',
      currency: 'usd',
      routingNumber: '110000000',
      accountHolderName: '',
      accountHolderType: 'individual'
    } ,
    validationErrors: {
      accountNumber: null,
      countryCode: null,
      currency: null,
      routingNumber: null,
      accountHolderName: null,
      accountHolderType: null
    }
  };

  onValueChange(field, value) {
    const {form, validationErrors} = this.state
    form[field] = value
    validationErrors[field] = null
    this.setState({form, validationErrors})
  }

  onClose = () => {
    this.props.onCancel()
  }

  onAccept = () => {
    this.props.onAccept(this.state.form)
  }

  render() {

    const {form} = this.state

    const addDisabled = form.accountNumber === '' || form.routingNumber === '' || form.countryCode === '' || form.currency === ''

    return (
      <Modal
        animationType='slide'
        presentationStyle={'overFullScreen'}
        transparent
        visible={this.props.visible}
        onRequestClose={this.onClose}
      >
        <Container >
          <Header>
            <Left>
              <Button transparent onPress={this.onClose}>
                <Icon name='ios-close-outline'/>
              </Button>
            </Left>
            <Body>
            <Title>{Lang('add_bank_account_title')}</Title>
            </Body>
            <Right>
              {!addDisabled && <Button transparent onPress={this.onAccept}>
                <Text>{Lang('add_bank_account_button')}</Text>
              </Button>}
            </Right>
          </Header>
          <Content  style={{backgroundColor: 'white'}}>
            <Form>
              <Item floatingLabel first>
                <Label>Account Number *</Label>
                <Input keyboardType={'numeric'} autoCapitalize={'none'}
                       autoCorrect={false}
                       onChangeText={this.onValueChange.bind(this, 'accountNumber')} value={form.accountNumber}/>
              </Item>
              <Item floatingLabel>
                <Label>Routing Number *</Label>
                <Input keyboardType={'numeric'} autoCapitalize={'none'}
                       autoCorrect={false}
                       onChangeText={this.onValueChange.bind(this, 'routingNumber')} value={form.routingNumber}/>
              </Item>
              <Item floatingLabel>
                <Label>Account Holder Name</Label>
                <Input keyboardType={'default'} autoCapitalize={'words'}
                       autoCorrect
                       onChangeText={this.onValueChange.bind(this, 'accountHolderName')}
                       value={form.accountHolderName}/>
              </Item>
            </Form>
          </Content>
        </Container>
      </Modal>
    )
  }
}
