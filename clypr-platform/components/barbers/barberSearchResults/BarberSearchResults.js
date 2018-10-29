// @flow
import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import { Text, Left, Right, Body, Thumbnail, Card, CardItem } from 'native-base';

import * as Models from '../../../../clypr-shared/models/dataModels';
import Lang from '../../../../clypr-shared/services/lang';
import { Styles } from '../../../../styles/global';
import { Utilities } from '../../../../clypr-shared/services/utilities';
import { BarberRating } from '../rating/BarberRating';

type Props = {
  barbers: Models.Barber[];
  isLoading: boolean;
  onSelect: (barber: Models.Barber) => void;
  onReload: () => void;
};

/** Render results for a barber search. */
export class BarberSearchResults extends PureComponent {

  props: Props;

  render() {
    return (
      <FlatList
        data={this.props.barbers}
        keyExtractor={this._keyExtractor}
        renderItem={({item}) => this.renderBarber(item)}
        onRefresh={this.props.onReload}
        refreshing={this.props.isLoading}
        ListEmptyComponent={<Text style={Styles.title}>{Lang('barbers_list_empty')}</Text>} />
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderBarber(aBarber: Models.Barber) {
    return (
      <Card>
        <CardItem button onPress={() => { this.props.onSelect(aBarber); }}>

          <Left style={Styles.listItemSides}>
            <Thumbnail source={
              aBarber.profile && aBarber.profile.avatarUrl ?
                { uri: aBarber.profile.avatarUrl } : require('../../../../assets/avatar.png')
              } />
          </Left>

          <Body style={Styles.listItemBody}>
            <Text>{ aBarber.profile.name }</Text>
            
            {aBarber.shop && aBarber.shop.address && aBarber.shop.address.shopName && (
              <Text note style={style.shopName}>{aBarber.shop.address.shopName}</Text>
            )}

            <Text note>
              { aBarber.shop && aBarber.shop.address && Utilities.getParsedAddress(aBarber.shop.address) }
            </Text>
          </Body>

          <Right style={style.rightInfo}>
            <BarberRating stars={aBarber.rating} />
            {aBarber.distance && <Text note>{aBarber.distance}</Text>}
          </Right>

        </CardItem>
      </Card>
    );
  }
}

const style = {

  shopName: {
    fontSize: 13,
    marginTop: 3,
    marginBottom: 1,
    color: 'black'
  },

  rightInfo: {
    alignSelf: 'flex-start'
  }

};
