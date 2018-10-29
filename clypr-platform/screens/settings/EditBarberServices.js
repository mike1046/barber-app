// @flow
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { List, ListItem, Body, Text, Button, Content } from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles, Variables } from '../../../styles/global';
import { Loading } from '../../components/Loading';
import { NavigationService } from '../../../services/navigator';

type State = {};

type Props = {
  isLoading: boolean;
  services: Models.BarberService[];
};

/** Implements this screen for Native platform. */
export class EditBarberServicesScreen extends Component {

  props: Props;
  render() {
    const services = this.props.services;

    return (
      <Content>
        <Text style={style.title}>{Lang('settings_edit_services_tip')}</Text>

        <Button transparent block
                onPress={this.addService}
                style={style.addButton}>
          <Text style={Styles.primaryColor}>{Lang('settings_edit_services_addItem')}</Text>
        </Button>

        <List>

          {services.map(service => (
            <ListItem key={service.id} button onPress={() => this.editService(service) }>
              <Body style={style.serviceContainer}>

                <View>
                  <Text style={style.serviceLabel}>{service.label}</Text>
                  <Text style={style.serviceDesc}>{service.desc}</Text>
                </View>

                <View style={style.serviceDetails}>
                  <Text style={style.servicePrice}>${service.price}</Text>
                  <Text style={style.serviceDuration}>
                    {service.durationInMinutes} {Lang('settings_edit_services_input_duration_label')}
                  </Text>
                </View>

              </Body>
            </ListItem>
          ))}

        </List>
      </Content>
    );
  }

  addService = () => {
    NavigationService.goTo('/settings/services/edit');
  }

  editService = (entry: Models.BarberService) => {
    NavigationService.goTo('/settings/services/edit', { entry });
  }
}

const style = {
  
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20
  },

  addButton: {
    marginVertical: 20
  },

  serviceLabel: {
    fontSize: 19
  },

  serviceDesc: {
    color: Variables.darkGrey,
  },

  servicePrice: {
    flex: 0,
    fontSize: 19,
    textAlign: 'right'
  },

  serviceDuration: {
    flex: 0,
    color: Variables.darkGrey,
    textAlign: 'right'
  },

  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  serviceDetails: {
    marginLeft: 10
  },

};
