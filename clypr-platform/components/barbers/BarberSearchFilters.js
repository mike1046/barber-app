// @flow
import React, { Component } from 'react';
import { View, Slider } from 'react-native';
import { Container, Header, Left, Body, Title, Right,
         Content, List, ListItem, Item, Icon, Input,
         Segment, Button, Text } from 'native-base';

import { Styles, Variables } from '../../../styles/global';
import type { BarberSearchOptions } from '../../../clypr-shared/services/barberSearch';
import Lang from '../../../clypr-shared/services/lang';

type State = {
  sort: 'distance' | 'price' | 'rating';
  distance: number;
  query: string;
};

type Props = {
  options: ?BarberSearchOptions;
  onSearch: (options: BarberSearchOptions) => void;
  onClose: () => void;
};

/** Render filters for barber search. */
export class BarberSearchFilters extends Component {

  _maxDistanceTurnUnlimited = 55;
  state: State = {
    sort: 'distance',
    distance: 55,
    query: ''
  };
  props: Props;

  componentWillMount() {
    // Use given options as current ones
    if (this.props.options) {
      const { query, distance, sort } = this.props.options;
      const updates = {};
      if (query) { updates.query = query; }
      if (distance) { updates.distance = distance; }
      if (sort) { updates.sort = sort; }

      this.setState(updates);
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Icon name='arrow-back' style={{color: 'white'}} onPress={this.props.onClose}/>
          </Left>
          <Body>
            <Title>{Lang('barbers_filter_title')}</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.search}><Text>{Lang('action_search')}</Text></Button>
          </Right>
        </Header>

        <Content>
          <List>
            <ListItem last>
              <Item rounded>
                <Input
                  placeholder={Lang('barbers_search_field')}
                  style={{paddingLeft: 20}}
                  value={this.state.query}
                  onChangeText={query => this.setState({ query })} />
              </Item>
            </ListItem>

            <ListItem itemDivider>
              <Text>{Lang('barbers_filter_sorting')}</Text>
            </ListItem>
            <ListItem last>
              <Segment style={{ flex: 1, backgroundColor: 'transparent' }}>
                <Button first style={(this.state.sort === 'distance') ? style.segmentButtonSelected: style.segmentButtonUnselected}
                        onPress={() => { this.setState({ sort: 'distance' }); }} >
                  <Text style={(this.state.sort === 'distance') ? style.segmentTextSelected: style.segmentTextUnselected}>{Lang('barbers_filter_distance')}</Text></Button>

                <Button style={(this.state.sort === 'price') ? style.segmentButtonSelected: style.segmentButtonUnselected}
                        onPress={() => { this.setState({ sort: 'price' }); }} >
                  <Text style={(this.state.sort === 'price') ? style.segmentTextSelected: style.segmentTextUnselected}>{Lang('barbers_filter_price')}</Text></Button>

                <Button last style={(this.state.sort === 'rating') ? style.segmentButtonSelected: style.segmentButtonUnselected}
                      onPress={() => { this.setState({ sort: 'rating' }); }} >
                  <Text style={(this.state.sort === 'rating') ? style.segmentTextSelected: style.segmentTextUnselected}>{Lang('barbers_filter_rating')}</Text></Button>
              </Segment>
            </ListItem>

            <ListItem itemDivider>
              <Text>{Lang('barbers_filter_distance_max')}</Text>
            </ListItem>
            <ListItem last>
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center' }}>
                  {this.state.distance == this._maxDistanceTurnUnlimited ? Lang('barbers_filter_distance_unlimited') : `${this.state.distance} ${Lang('unities_miles')}`}
                </Text>
                <Slider minimumValue={5}
                        maximumValue={this._maxDistanceTurnUnlimited}
                        step={5}
                        value={this.state.distance}
                        onValueChange={distance => { this.setState({ distance }); }}
                        style={{flex: 1}} />
              </View>
            </ListItem>

          </List>
        </Content>
      </Container>
    );
  }

  search = () => {
    // Create options object
    let { query, distance, sort } = this.state;

    // Disable distance filter if set to unlimited
    if (distance >= this._maxDistanceTurnUnlimited) { distance = null; }

    // Send updated options object
    this.props.onSearch({ query, distance, sort });
  }
}

const style = {

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

}