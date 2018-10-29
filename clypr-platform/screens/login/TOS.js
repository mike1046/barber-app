// @flow
import React, {Component} from 'react';
import {Modal, WebView} from 'react-native';
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  H1,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Left,
  ListItem,
  Right,
  Text,
  Title,
} from 'native-base';

import Lang from '../../../clypr-shared/services/lang';

type Props = {
  visible: boolean;
  onClose: (boolean) => void;
};

type State = {
  visible: boolean;
  html: string;
}

export class TOS extends Component {

  props: Props;
  state: State = {
    visible: false,
    html: ''
  };

  componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible || false});
  }

  render() {
    return (
      <Modal
        animationType='slide'
        presentationStyle={'overFullScreen'}
        transparent
        visible={this.state.visible}
        onRequestClose={this.onClose}
      >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.onClose}>
                <Icon name='ios-close-outline'/>
              </Button>
            </Left>
            <Body>
            <Title>{Lang('tos_title')}</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.onAccept}>
                <Text>{Lang('tos_accept')}</Text>
              </Button>
            </Right>
          </Header>
          <WebView scalesPageToFit={false} source={require('../../../assets/tos.html')}/>
        </Container>
      </Modal>);
  }

  onAccept = () => {
    this.props.onClose(true);
  }

  onClose = () => {
    this.props.onClose(false);
  }
}

const style = {};
