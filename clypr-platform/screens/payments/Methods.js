// @flow
import React, {Component} from 'react';
import {FlatList, View, TouchableOpacity, Image} from 'react-native';
import {Body, Button, Icon, Left, List, ListItem, Right, Text} from 'native-base'
///
import {PaymentMethodService} from '../../../clypr-shared/services/paymentMethods';
import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import {Styles, Variables} from '../../../styles/global';
import {Loading} from '../../components/Loading';

type State = {
  sources: Models.StripeCard[];
  isLoading: boolean;
};

/** Implements this screen for Native platform. */
export class PaymentMethodsScreen extends Component {
  _observer;

  componentDidMount() {
    // Listen for all sources
    this.setState({isLoading: true});

    this._observer = PaymentMethodService.observeAllSources(sources => {
      this.setState({sources, isLoading: false});
    });
  }

  componentWillUnmount() {
    if (this._observer) {
      this._observer.unsubscribe();
    }
  }

  setDefault = (source) => {
    this.setState({isLoading: true});
    return PaymentMethodService.setDefault(source).then(() => {
      this.setState({isLoading: false});
    }).catch((err) => {
      this.setState({isLoading: false});
    })
  }

  removeSource = (source) => {
    this.setState({isLoading: true});
    return PaymentMethodService.removeSource(source).then(() => {
      this.setState({isLoading: false});
    }).catch((err) => {
      this.setState({isLoading: false});
    })
  }

  addSource = () => {
    this.setState({isLoading: true});
    PaymentMethodService.addSource().then(() => {
      this.setState({isLoading: false});
    }).catch((err) => {
      this.setState({isLoading: false});
    })
  }

  state: State = {
    sources: [],
    isLoading: false,
  };

  render() {
    if (this.state.isLoading) {
      return <Loading/>;
    }

    return (
      <View>
        <FlatList data={this.state.sources}
                  style={{backgroundColor: 'white'}}
                  keyExtractor={this._keyExtractor}
                  renderItem={({item}) => this.renderSource(item)}
                  refreshing={this.state.isLoading}
                  ListEmptyComponent={<Text style={Styles.title}>{Lang('source_list_empty')}</Text>}/>
        <Button full
                disabled={this.state.isLoading}
                style={Styles.submit}
                onPress={this.addSource}>
          <Text style={Styles.submitText}>{Lang('action_add_source')}</Text>
        </Button>

      </View>
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderSource = (source: Models.StripeCard) => {
    return (<ListItem icon>
      <Left>
        <Image style={{height: 26, width: 42, resizeMode: 'contain'}} source={source.brandImage} />
      </Left>
      <Body>
      <Text>{Lang('payment_source_last4').replace('__LAST4__', source.last4)}</Text>
      </Body>
      <Right>
        {source.isDefault === true && <Text>Default</Text>}
        {source.isDefault === false && <TouchableOpacity onPress={this.setDefault.bind(this, source)}>
          <Text style={{color: Variables.nativeBasePrimaryColor}}>Set Default</Text>
        </TouchableOpacity>}
        <Button transparent onPress={this.removeSource.bind(this, source)}>
          <Icon name={'remove-circle'}/>
        </Button>
      </Right>
    </ListItem>)
  }

}
