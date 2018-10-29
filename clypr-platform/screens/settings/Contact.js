// @flow
import React, { Component } from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import { Button, Text } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import { Styles, Variables } from '../../../styles/global';
import { Loading } from '../../components/Loading';

type Props = {
  onSubmitMessage: (message: string) => void;
  isLoading: boolean;
  isCompleted: boolean;
}

type State = {
  message: string;
}

/** Implements this screen for Native platform. */
export class ContactScreen extends Component {

  props: Props;
  state: State = { message: '' };

  render() {
    if (this.props.isLoading) { return <Loading />; }

    if (this.props.isCompleted) {
      // Success after sending a message
      return (
        <View style={Styles.section}>
          <Text style={style.title}>{Lang('contact_confirmation_title')}</Text>
          <Text style={style.success}>{Lang('contact_confirmation_message')}</Text>
        </View>
      );
    } else {
      // Message compose mode
      return (
        <ScrollView>
          <View style={Styles.section}>
            <Text style={style.title}>{Lang('contact_title')}</Text>
            <TextInput
              style={style.input}
              multiline={true}
              autoFocus={true}
              placeholder={Lang('contact_form_text')}
              value={this.state.message}
              onChangeText={(message: string) => this.setState({ message })}
              />
          </View>

          <Button full style={Styles.submit} onPress={this.submit}>
            <Text style={{ color: 'white' }}>{Lang('contact_submit')}</Text>
          </Button>
        </ScrollView>
      );
    }
  }

  submit = () => {
    this.props.onSubmitMessage(this.state.message);
  }

}

const style = {

  title: {
    fontSize: 18,
    marginHorizontal: 10,
    marginVertical: 20,
    textAlign: 'center',
  },

  input: {
    fontSize: 16,
    height: 180,
    backgroundColor: Variables.backgroundGrey,
    borderRadius: 5,
    padding: 15
  },

  success: {
    textAlign: 'center'
  }

};
