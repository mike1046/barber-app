// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Text, Left, Right, Body, Thumbnail, Card, CardItem } from 'native-base';

import * as Models from '../../../clypr-shared/models/dataModels';
import { Styles } from '../../../styles/global';
import { FavoriteStatus } from './FavoriteStatus';

type Props = {
  entries: Models.BarberClient[];
  onSelect: (client: Models.BarberClient) => void;
};

/** Render a list of clients a barber has. */
export class ClientsList extends Component {

  props: Props;

  render() {
    return (
      <FlatList
        data={this.props.entries}
        keyExtractor={this._keyExtractor}
        renderItem={({item}) => this.renderClient(item)}
        style={Styles.section} />
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderClient(client: Models.BarberClient) {
    return (
      <Card>
        <CardItem button onPress={() => { this.props.onSelect(client); }}>

          <Left style={Styles.listItemSides}>
            <Thumbnail source={
              client.avatarUrl ? { uri: client.avatarUrl } : require('../../../assets/avatar.png')
              } />
          </Left>

          <Body style={Styles.listItemBody}>
            <Text>{ client.name }</Text>
          </Body>

          <Right>
            {client.isFavorite && <FavoriteStatus isFavorite={client.isFavorite} />}
          </Right>

        </CardItem>
      </Card>
    );
  }

}
