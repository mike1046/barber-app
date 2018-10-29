// @flow
import React, { PureComponent } from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { Form, Item, Label, Input, Button, Text, Picker, Content } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import { Alert } from '../../../services/alert';
import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles, Variables } from '../../../styles/global';
import { AccountService } from '../../../clypr-shared/services/account';
import { Loading } from '../../components/Loading';

interface State extends Models.EncodedAddress {}

type Props = {
  isLoading: boolean;
  address: Models.EncodedAddress;
  onSave: (address: Models.EncodedAddress) => void;
};

/** Implements this screen for Native platform. */
export class EditAddressScreen extends PureComponent {

  state: State;
  props: Props;

  constructor(props: Props) {
    super(props);

    // Use given address
    this.state = this.props.address;
  }

  render() {
    if (this.props.isLoading) { return <Loading />; }

    return (
      <Content>
        <Text style={style.title}>{Lang('settings_edit_address_tip')}</Text>

        <Form style={Styles.form}>

          {this.inputField('shopName', false, true)}
          {this.inputField('street')}
          {this.inputField('street2')}
          {this.inputField('city')}
          {this.inputField('zipcode', true)}

          <View style={style.stateField}>
            <Text style={style.stateFieldLabel}>{Lang('settings_edit_address_input_state')}</Text>

            <Picker iosHeader={Lang('settings_edit_address_input_stateSelect')}
                    mode="dropdown"
                    selectedValue={this.state.state}
                    onValueChange={(state: string) => this.setState({ state })} >
              <Item value="AL" label="Alabama" />
              <Item value="AK" label="Alaska" />
              <Item value="AZ" label="Arizona" />
              <Item value="AR" label="Arkansas" />
              <Item value="CA" label="California" />
              <Item value="CO" label="Colorado" />
              <Item value="CT" label="Connecticut" />
              <Item value="DE" label="Delaware" />
              <Item value="DC" label="District Of Columbia" />
              <Item value="FL" label="Florida" />
              <Item value="GA" label="Georgia" />
              <Item value="HI" label="Hawaii" />
              <Item value="ID" label="Idaho" />
              <Item value="IL" label="Illinois" />
              <Item value="IN" label="Indiana" />
              <Item value="IA" label="Iowa" />
              <Item value="KS" label="Kansas" />
              <Item value="KY" label="Kentucky" />
              <Item value="LA" label="Louisiana" />
              <Item value="ME" label="Maine" />
              <Item value="MD" label="Maryland" />
              <Item value="MA" label="Massachusetts" />
              <Item value="MI" label="Michigan" />
              <Item value="MN" label="Minnesota" />
              <Item value="MS" label="Mississippi" />
              <Item value="MO" label="Missouri" />
              <Item value="MT" label="Montana" />
              <Item value="NE" label="Nebraska" />
              <Item value="NV" label="Nevada" />
              <Item value="NH" label="New Hampshire" />
              <Item value="NJ" label="New Jersey" />
              <Item value="NM" label="New Mexico" />
              <Item value="NY" label="New York" />
              <Item value="NC" label="North Carolina" />
              <Item value="ND" label="North Dakota" />
              <Item value="OH" label="Ohio" />
              <Item value="OK" label="Oklahoma" />
              <Item value="OR" label="Oregon" />
              <Item value="PA" label="Pennsylvania" />
              <Item value="RI" label="Rhode Island" />
              <Item value="SC" label="South Carolina" />
              <Item value="SD" label="South Dakota" />
              <Item value="TN" label="Tennessee" />
              <Item value="TX" label="Texas" />
              <Item value="UT" label="Utah" />
              <Item value="VT" label="Vermont" />
              <Item value="VA" label="Virginia" />
              <Item value="WA" label="Washington" />
              <Item value="WV" label="West Virginia" />
              <Item value="WI" label="Wisconsin" />
              <Item value="WY" label="Wyoming" />
            </Picker>
          </View>

          <View style={style.stateField}>
            <Text style={style.stateFieldLabel}>{Lang('settings_edit_address_input_timezoneSelect')}</Text>

            <Picker iosHeader={Lang('settings_edit_address_input_timezoneSelect')}
                    mode="dropdown"
                    selectedValue={this.state.timezone}
                    onValueChange={(timezone: string) => this.setState({ timezone })} >
              <Item value="US/Pacific" label="Pacific Time" />
              <Item value="US/Mountain" label="Mountain Time" />
              <Item value="US/Central" label="Central Time" />
              <Item value="US/Eastern" label="Eastern Time" />
            </Picker>
          </View>

          <Button full
                  style={Styles.submit}
                  onPress={this.save}>
            <Text style={Styles.submitText}>{Lang('action_save')}</Text>
          </Button>
        </Form>
      </Content>
    );
  }

  // Generate reusable input field
  inputField = (id: string, isNumeric: boolean = false, autoFocus: boolean = false) => (
    <Item floatingLabel>
      <Label style={Styles.inputLabelFloating}>{Lang('settings_edit_address_input_'+id)}</Label>
      <Input style={Styles.input}
             keyboardType={isNumeric ? 'numeric' : 'default'}
             autoFocus={autoFocus}
             returnKeyType="done"
             onSubmitEditing={this.save}
             // $FlowExpectedError
             value={this.state[id]}
             onChangeText={(val: string) => this.setState({ [id]: val })} />
    </Item>
  );

  save = () => {
    const { shopName, street, street2, city, state, zipcode, timezone } = this.state;
    
    if (shopName && street && city && state) {
      this.props.onSave({ shopName, street, street2, city, state, zipcode, timezone });
    } else {
      Alert.show(Lang('form_field_error'));
    }
  }
}

const style = {
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20
  },

  stateField: {
    marginTop: 10
  },

  stateFieldLabel: {
    color: Variables.nativeBaseFloatingFormFieldLabel,
    fontSize: 15,
    marginLeft: 15
  }
};
