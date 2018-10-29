// @flow
import React, { Component } from 'react';
import { View, Text, Card, CardItem, Body } from 'native-base';

import * as Models from '../../../../clypr-shared/models/dataModels';
import Lang from '../../../../clypr-shared/services/lang';

type Props = {
  services: Models.BarberService[];
  onSelect?: (serviceId: string) => void;
};

/** Render a quick list of services from a barber. */
export class ServicesList extends Component {

  props: Props;

  render() {
    const services = this.props.services;

    return (
      <View style={style.services}>
        {services.map(service => (
          <Card key={service.id}>
            <CardItem
              button={this.props.onSelect != null}
              onPress={() => this.props.onSelect && this.props.onSelect(service.id)}>
              <Body>
                <View style={style.serviceTitle}>
                  <Text style={style.serviceLabel}>{service.label}</Text>
                  <Text style={style.servicePrice}>${service.price}</Text>
                </View>

                <Text note style={style.serviceDuration}>{service.durationInMinutes} {Lang('time_minutes')}</Text>
                <Text style={style.serviceDesc}>{service.desc}</Text>
              </Body>
            </CardItem>
          </Card>
        ))}
      </View>
    )
  }
}

const style = {

  services: {},
  serviceTitle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 1,
    justifyContent: 'space-between'
  },
  serviceLabel: {},
  servicePrice: {},
  serviceDuration: {},
  serviceDesc: {
    fontSize: 14,
    marginTop: 5
  },

};
