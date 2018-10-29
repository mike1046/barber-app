// @flow
import React, { PureComponent } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Form, Item, Label, Input, Button, Text } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import { Alert } from '../../../services/alert';
import { Styles } from '../../../styles/global';
import { AccountService } from '../../../clypr-shared/services/account';
import { Loading } from '../../components/Loading';

type State = {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

type Props = {
  isLoading: boolean;
  onSubmit: (oldPassword: string, newPassword: string) => void;
};

/** Implements this screen for Native platform. */
export class EditCredentialsScreen extends PureComponent {

  state: State = { oldPassword: '', newPassword: '', repeatPassword: '' };
  props: Props;
  
  render() {
    if (this.props.isLoading) { return <Loading />; }

    return (
      <ScrollView>

        <Form style={Styles.form}>
          <Item floatingLabel>
            <Label style={Styles.inputLabelFloating}>{Lang('settings_edit_password_input_old')}</Label>
            <Input password
                   style={Styles.input}
                   value={this.state.oldPassword}
                   onChangeText={(oldPassword: string) => this.setState({ oldPassword })} />
          </Item>

          <Item floatingLabel>
            <Label style={Styles.inputLabelFloating}>{Lang('settings_edit_password_input_new')}</Label>
            <Input password
                   style={Styles.input}
                   value={this.state.newPassword}
                   onChangeText={(newPassword: string) => this.setState({ newPassword })} />
          </Item>

          <Item floatingLabel>
            <Label style={Styles.inputLabelFloating}>{Lang('settings_edit_password_input_repeat')}</Label>
            <Input password
                   style={Styles.input}
                   value={this.state.repeatPassword}
                   onChangeText={(repeatPassword: string) => this.setState({ repeatPassword })}
                   returnKeyType="done"
                   onSubmitEditing={this.submit} />
          </Item>

          <Button full
                  style={Styles.submit}
                  onPress={this.submit}>
            <Text style={Styles.submitText}>{Lang('action_confirm')}</Text>
          </Button>
        </Form>
      </ScrollView>
    );
  }

  submit = () => {
    const { oldPassword, newPassword, repeatPassword } = this.state;

    if (oldPassword && newPassword && repeatPassword) {
      // Check if new password matches
      if (newPassword === repeatPassword) {
        // Send data
        this.props.onSubmit(oldPassword, newPassword);
      } else {
        Alert.show(Lang('settings_edit_password_error1'));
        this.setState({ newPassword: '', repeatPassword: '' });
      }
    } else {
      Alert.show(Lang('form_field_error'));
    }
  }

}
