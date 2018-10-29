// @flow
import React, { PureComponent } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Form, Item, Label, Input, Button, Text } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import { Styles } from '../../../styles/global';
import { Loading } from '../../components/Loading';

type State = {
  password: string;
};

type Props = {
  isLoading: boolean;
  onSubmit: (password: string) => void;
};

/** Implements this screen for Native platform. */
export class DeleteAccountScreen extends PureComponent {

  state: State = { password: '' };
  props: Props;
  
  render() {
    if (this.props.isLoading) { return <Loading />; }

    return (
      <ScrollView>

        <Text style={Styles.title}>{Lang('settings_deleteAccount_message')}</Text>

        <Form style={Styles.form}>
          <Item floatingLabel>
            <Label style={Styles.inputLabelFloating}>{Lang('settings_deleteAccount_password')}</Label>
            <Input password
                   style={Styles.input}
                   value={this.state.password}
                   onChangeText={(password: string) => this.setState({ password })} />
          </Item>

          <Button full
                  danger
                  onPress={this.submit}>
            <Text style={Styles.submitText}>{Lang('settings_deleteAccount_submit')}</Text>
          </Button>
        </Form>
      </ScrollView>
    );
  }

  submit = () => {
    // Send data
    this.props.onSubmit(this.state.password);
  }

}
