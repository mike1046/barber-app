// @flow
import React, { PureComponent } from 'react';
import { View, ScrollView, Image, TouchableHighlight } from 'react-native';
import { Button, Text, Segment } from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import {Styles, Variables} from '../../../styles/global';
import { Loading } from '../../components/Loading';

import { BarberAvatar } from '../../components/barbers/profile/BarberAvatar';
import { AddressWithMap } from '../../components/barbers/profile/AddressWithMap';
import { ShopHours } from '../../components/barbers/profile/ShopHours';
import { ServicesList } from '../../components/barbers/profile/ServicesList';
import { MediaGallery } from '../../components/barbers/profile/MediaGallery';
import { ReviewsList } from '../../components/barbers/review/ReviewsList';

type Props = {
  barber: ?Models.Barber,
  isLoading: boolean,
  onCreateAppointment: (withServiceId?: string) => void,
  isPreviewMode?: boolean;
};

type State = {
  view: 'shop' | 'gallery' | 'reviews'
};

/** Implements Barber Profile screen for Web platform. */
export class BarberProfileScreen extends PureComponent {

  state: State = { view: 'shop' };
  props: Props;

  render() {
    if (this.props.isLoading) { return <Loading />; }
    const barber = this.props.barber;

    return barber ? (
      <View style={style.container}>

        <View style={style.header}>
          {/* Barber badge with avatar, name and rating. */}
          <View style={style.avatar}>
            <BarberAvatar barber={barber} />
          </View>

          {/* Sub menu. */}
          <Segment style={style.menu}>
            <Button first style={(this.state.view === 'shop') ? style.segmentButtonSelected: style.segmentButtonUnselected}
                    onPress={() => { this.setState({ view: 'shop' }); }}>
              <Text style={(this.state.view === 'shop') ? style.segmentTextSelected: style.segmentTextUnselected}>{Lang('barber_profile_tab_shop')}</Text>
            </Button>

            <Button style={(this.state.view === 'gallery') ? style.segmentButtonSelected: style.segmentButtonUnselected}
                    onPress={() => { this.setState({ view: 'gallery' }); }}>
              <Text style={(this.state.view === 'gallery') ? style.segmentTextSelected: style.segmentTextUnselected}>{Lang('barber_profile_tab_gallery')}</Text>
            </Button>

            <Button last style={(this.state.view === 'reviews') ? style.segmentButtonSelected: style.segmentButtonUnselected}
                    onPress={() => { this.setState({ view: 'reviews' }); }}>
              <Text style={(this.state.view === 'reviews') ? style.segmentTextSelected: style.segmentTextUnselected}>{Lang('barber_profile_tab_reviews')}</Text>
            </Button>
          </Segment>
        </View>

        <View style={style.content}>
          {/* Barber shop. */}
          {this.state.view === 'shop' && (
            <ScrollView style={style.shop}>
              <View style={style.shopInfo}>
                {/* Barber address on a map. */}
                <View style={style.map}>
                  {barber.shop && barber.shop.address && <AddressWithMap address={barber.shop.address} />}
                </View>

                {/* Barber shop hours. */}
                <View style={style.hours}>
                  {barber.shop && barber.shop.hours && <ShopHours hours={barber.shop.hours} />}
                </View>
              </View>

              {/* Barber services. */}
              {barber.services && (
                <View style={style.services}>
                  <ServicesList services={barber.services} onSelect={this.props.onCreateAppointment} />
                </View>
              )}

              {!barber || !barber.shop || (!barber.shop.hours && !barber.shop.map && !barber.services) && (
                <Text style={style.empty}>{Lang('barber_profile_empty')}</Text>
              )}
            </ScrollView>
          )}

          {/* Barber gallery. */}
          {this.state.view === 'gallery' && (
            <MediaGallery media={barber.mediaGallery} disableTaps={this.props.isPreviewMode} />
          )}

          {/* Barber reviews. */}
          {this.state.view === 'reviews' && (
            <ScrollView style={style.reviews}>
              <ReviewsList entries={barber.reviews || []} />
              {(!barber.reviews || barber.reviews.length === 0) && <Text style={style.empty}>{Lang('barber_profile_tab_reviews_empty')}</Text>}
            </ScrollView>
          )}
        </View>

        <View style={style.footer}>
          <Button full onPress={() => this.props.onCreateAppointment()} style={Styles.primaryBackground}>
            <Text style={style.mainButtonText}>{Lang('barber_profile_action_appointment')}</Text>
          </Button>
        </View>
      </View>
    ) : <Text style={style.empty}>{Lang('barber_profile_unknown')}</Text>;
  }

}

const style = {

  container: {
    flex: 1
  },

  header: {
    flex: 0
  },

  content: {
    flex: 1
  },

  footer: {
    flex: 0
  },

  menu: {
    backgroundColor: 'transparent',
    marginBottom: 3

  },

  segmentButtonSelected: {
    borderColor: Variables.primaryColor,
      backgroundColor: Variables.primaryColor
    },
  segmentButtonUnselected: {
    borderColor: Variables.primaryColor,
    backgroundColor: 'transparent'
  },

  segmentTextSelected: {
    color: Variables.primaryLightColor
  },

  segmentTextUnselected: {
    color: Variables.primaryColor
  },

  mainButtonText: {
    color:'white',
    fontSize: 18
  },

  empty: {
    textAlign: 'center'
  },


  avatar: {
    marginVertical: 20,
  },

  services: {
    marginHorizontal: 10,
    marginTop: 15
  },


  shop: {
    flex: 1
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  map: {
    flex: 1,
    padding: 10
  },

  hours: {
    flex: 0,
    marginRight: 10,
  },

  reviews: {
    marginHorizontal: 10,
    flex: 1
  },
};
