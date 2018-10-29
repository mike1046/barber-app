// @flow
import React, {Component} from 'react';
import {Modal, WebView, BackHandler, ActivityIndicator} from 'react-native';
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
import Uri from 'jsuri';

type Props = {
  uri: string;
  title: string;
  visible: boolean;
  onClose: () => void;
};

type State = {
  visible: boolean;
  backButtonEnabled: boolean;
  loading: boolean;
}

export class Browser extends Component {

  props: Props;
  state: State = {
    visible: false,
    loading: false
  };


  componentDidMount() {
    this.setState({uri: this.props.uri})
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler)
  }


  componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible || false});
  }

  render() {
    const {title, uri} = this.props;

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
            <Title>{title}</Title>
            </Body>
            <Right>
              <ActivityIndicator animating={this.state.loading}/>
            </Right>
          </Header>
          <WebView onLoadStart={() => this.setState({loading: true})} onLoadEnd={() => this.setState({loading: false})} scalesPageToFit={false} source={{uri}} ref='webview' onNavigationStateChange={this.onNavigationStateChange}/>
        </Container>
      </Modal>);
  }

  onClose = () => {
    this.props.onClose();
  }

  backHandler = () => {
    if (this.state.backButtonEnabled) {
      this.refs.webview.goBack();
      return true;
    }
    else {
      this.onClose();
    }
  }

  onNavigationStateChange = (navState) => {

    const uri = new Uri(navState.url)

    if (uri.protocol() === 'http' || uri.protocol() === 'https') {
      this.setState({uri: navState.url})

      if (uri.host() === 'localhost'
        && uri.path() === '/close') {
        this.onClose()
      }
    }


    this.setState({
      backButtonEnabled: navState.canGoBack
    });
  }

}

const style = {};
