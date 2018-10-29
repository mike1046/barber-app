// @flow
// $FlowIgnoreExpoBug
import React from 'react';
import {Image, View} from 'react-native';
import {Container} from 'native-base';
// Import components shared by all platforms
import * as Models from './clypr-shared/models/dataModels';
import {LoginScreenContainer} from './clypr-shared/containers/screens/Login';
import {AccountService} from './clypr-shared/services/account';
import {MessagingService} from './clypr-shared/services/messaging';
// Import components exclusive of this platform
import {TabBar} from './components/tabBar/TabBar';
import {BarberTabs, ClientTabs} from './routes/Tabs';
import {Variables} from './styles/global'

type State = {
  isLoggedIn: boolean;
  currentUser: ?Models.User;
  isAppReadyToLoad: boolean;
};

type Props = {};

/** Root app component. */
export default class App extends React.Component {

  state: State = {
    isLoggedIn: false,
    currentUser: null,
    isAppReadyToLoad: false
  };
  props: Props;

  /** Prepare app before rendering. React Native is not suppose to handle this async method,
   * but it will execute the async tasks properly anyway.
   */
  // $FlowIgnoreExpoBug
  async componentWillMount() {
    // Load Expo fonts
    // await Expo.Font.loadAsync({
    //   'Roboto': require('native-base/Fonts/Roboto.ttf'),
    //   'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    // });

    // Load persisted login data
    await AccountService.loadDataAsync();

    // Observe login state and mark app as ready after first response
    AccountService.observeCurrentUser((isLoggedIn, currentUser) => {
      this.setState({isLoggedIn, currentUser});
      setTimeout(() => {
        this.setState({isAppReadyToLoad: true})
      }, 2000)
    });

    MessagingService.observeNotification((message) => {
    })
  }

  render() {
    // Only proceed if fonts are loaded
    if (!this.state.isAppReadyToLoad) {
      return (
        <Container>
          <View style={style.background}>
            <Image source={require('./assets/clypr-logo-transparent.png')} style={style.logo}/>
          </View>
        </Container>
      )
    }

    // Render depending on login state
    const isLoggedIn = this.state.isLoggedIn;
    const user = this.state.currentUser;

    const userRole = user && user.role;
    const tabs = userRole === 'barber' ? BarberTabs : ClientTabs;

    return isLoggedIn ? <TabBar tabs={tabs}/> : <LoginScreenContainer/>;
  }
}

const style = {

  background: {
    flex: 1,
    width: '100%',
    backgroundColor: Variables.primaryLightColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: 250
  }
};
