// @flow
import React, { Component } from 'react';
import { ScrollView, Slider, TextInput } from 'react-native';
import { View, Text, Form, Item, Label, Input, Button, Content } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import { Alert } from '../../../services/alert';
import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles, Variables } from '../../../styles/global';
import { NavigationService } from '../../../services/navigator';
import { ShopService } from '../../../clypr-shared/services/shop';
import { Loading } from '../../components/Loading';

type Props = {
  entry: Models.BarberService;
};

interface State extends Models.BarberService {
  isLoading?: boolean;
}

/** Add barber service on native app. */
export class EditBarberServiceItemScreen extends Component {

  state: State;
  props: Props;
  defaultService = {
    id: '',
    label: '',
    desc: '',
    durationInMinutes: 30,
    price: 10
  };
  _minimumServicePrice = 5;

  constructor(props: Props) {
    super(props);

    // Use given service if possible
    this.state = (this.props.entry && Object.assign({}, this.props.entry)) || this.defaultService;
  }

  render() {
    if (this.state.isLoading) { return <Loading />; }

    return (
      <Content extraHeight={150}>
        <Form>

          <Item floatingLabel>
            <Label style={Styles.inputLabelFloating}>{Lang('settings_edit_services_input_label')}</Label>
            <Input style={Styles.input}
                  value={this.state.label}
                  onChangeText={(label: string) => this.setState({ label })} />
          </Item>

          <Item floatingLabel>
            <Label style={Styles.inputLabelFloating}>{Lang('settings_edit_services_input_desc')}</Label>
            <Input style={Styles.input}
                  value={this.state.desc}
                  onChangeText={(desc: string) => this.setState({ desc })} />
          </Item>

          <View style={style.inputContainer}>
            <Text style={style.inputLabel}>
              {Lang('settings_edit_services_input_duration')}
            </Text>
          
            <View style={style.inputEdit}>
              <TextInput
                style={[style.numericInput, style.inputAtLeft]}
                keyboardType="numeric"
                value={this.state.durationInMinutes.toString()}
                onChangeText={durationInMinutes => this.setState({ durationInMinutes: Number(durationInMinutes) })} />
              <Text style={style.inputUnit}>{Lang('time_minutes')}</Text>
            </View>
          </View>

          <View style={style.inputContainer}>
            <Text style={style.inputLabel}>
              {Lang('settings_edit_services_input_price')}
            </Text>
          
            <View style={style.inputEdit}>
              <Text style={style.inputUnit}>$</Text>
              <TextInput
                style={[style.numericInput, style.inputAtRight]}
                keyboardType="numeric"
                value={this.state.price.toString()}
                onChangeText={price => this.setState({ price: isNaN(price) ? 0 : Number(price) })}
                onBlur={() => {
                  // Only accept values higher than minimum price
                  if (this.state.price < this._minimumServicePrice) {
                    Alert.show(Lang('settings_edit_services_error1') + ' $' + this._minimumServicePrice);
                    this.setState({ price: this._minimumServicePrice });
                  }
                }} />
            </View>
          </View>

          <Button full
                  style={Styles.submit}
                  onPress={this.save}>
            <Text style={Styles.submitText}>{Lang('action_save')}</Text>
          </Button>

          {this.props.entry && this.props.entry.id && (
            <Button block
                    danger
                    transparent
                    onPress={this.delete}>
              <Text>{Lang('action_delete')}</Text>
            </Button>
          )}

        </Form>
      </Content>
    );
  }

  save = () => {
    // Build service data
    let { id, label, desc, durationInMinutes, price } = this.state;

    // Remove decimal houses
    if (durationInMinutes) { durationInMinutes = Math.round(Number(durationInMinutes)); }
    if (price) { price = Math.round(Number(price)); }

    if (label && desc && durationInMinutes > 0 && price > 0) {
      const service: Models.BarberService = { id, label, desc, durationInMinutes, price };

      // Save service on barber data
      this.setState({ isLoading: true });
      ShopService.updateService(service, 'edit').then(() => {
        // Success!
        NavigationService.goBack();
        this.setState({ isLoading: false });
      }).catch(err => {
        Alert.show(err);
        this.setState({ isLoading: false });
      });
    } else {
      Alert.show(Lang('form_field_error'));
    }
  }

  delete = () => {
    // Request deletion of service if it has a valid id
    if (this.props.entry && this.props.entry.id) {
      this.setState({ isLoading: true });
      ShopService.updateService(this.props.entry, 'remove').then(() => {
        // Success!
        NavigationService.goBack();
        this.setState({ isLoading: false });
      }).catch(err => {
        Alert.show(err);
        this.setState({ isLoading: false });
      });
    }
  }
}

const style = {

  inputContainer: {
    flex: 1,
    
    marginVertical: 10,
    marginLeft: 15,
    
    paddingBottom: 6,
    borderBottomColor: Variables.nativeBaseFormFieldBorder,
    borderBottomWidth: 1
  },

  inputLabel: {
    color: Variables.nativeBaseFloatingFormFieldLabel,
    fontSize: 15,
    marginBottom: 20
  },

  inputEdit: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  inputUnit: {
    fontSize: 18,
    color: Variables.darkGrey
  },

  numericInput: {
    backgroundColor: Variables.primaryLightColor,
    width: 60,
    height: 40,
    textAlign: 'center',
    borderRadius: 3
  },

  inputAtRight: { marginLeft: 10 },
  inputAtLeft: { marginRight: 10 },

  
  sliderContainer: {
    flex: 1,
    marginVertical: 20
  },

  sliderLabel: {
    textAlign: 'center',
    fontSize: 15,
    color: Variables.grey,
    marginBottom: 5
  },

  sliderValue: {
    textAlign: 'center',
    fontSize: 20
  },

  slider: {
    flex: 1,
    marginRight: 15
  }

}