// @flow
import React, {PureComponent} from 'react';
import {Linking, ScrollView} from 'react-native';
import {Body, Button, Icon, Left, List, ListItem, Right, Text, Title, View} from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import * as Models from '../../../clypr-shared/models/dataModels';
import {Styles} from '../../../styles/global';
import {AccountService} from '../../../clypr-shared/services/account';
import {Stripe} from '../../../styles/global';
import {Browser} from '../../components/Browser';

type Props = {
  onNavigate: (path: string) => void;
  role: ?Models.UserRole;
};

type State = {
  user: ?Models.User;
  browserVisible: boolean;
  uri: string;
  title: string;
}

/** Implements Settings screen for Native platform. */
export class SettingsScreen extends PureComponent {

  props: Props;
  state: State = {
    user: null,
    browserVisible: false,
    uri: '',
    title: '',
  }

  componentDidMount() {
    this._userListener = AccountService.observeCurrentUser((isLoggedIn, user) => {
      if( user && user.id){
        this.setState({user});
      }
    });
  }

  componentWillUnmount() {
    if (this._userListener) { this._userListener.unsubscribe(); }
  }

  render() {
    // Render depends on user's role
    return (
      <ScrollView>
        {this.props.role === 'barber' ? this.getBarberSettings() : this.getClientSettings()}
        <Browser visible={this.state.browserVisible} uri={this.state.uri} title={this.state.title} onClose={this.onBrowserClose}/>
      </ScrollView>
    );
  }

  logoutNativeApp = () => {
    // Just logout because native router will handle screens properly.
    AccountService.logout();
  };

  getCommonSettings = () => {
    const inviteBarbersByEmail = `mailto:?subject=${
      encodeURIComponent(Lang('invitation_barbers_email_subject'))
      }&body=${
      encodeURIComponent(Lang('invitation_barbers_email_body'))
      }`;

    const inviteClientsByEmail = `mailto:?subject=${
      encodeURIComponent(Lang('invitation_clients_email_subject'))
      }&body=${
      encodeURIComponent(Lang('invitation_clients_email_body'))
      }`;

    return (
      <View>
        {this.header(Lang('settings_share_title'))}
        {this.option(inviteBarbersByEmail, 'person', Lang('share_barbers'), false, 'email')}
        {this.option(inviteClientsByEmail, 'person', Lang('share_clients'), false, 'email')}

        {this.header(Lang('settings_about_title'))}
        {this.option('https://www.clypr.net/faq', 'help-circle', Lang('settings_about_faq'), false, 'url')}
        {this.option('https://www.clypr.net/tos', 'document', Lang('settings_about_tos'), false, 'url')}
        {this.option('https://www.clypr.net/privacy', 'lock', Lang('settings_about_privacy'), false, 'url')}
        {this.option('/settings/contact', 'mail', Lang('settings_contact_title'), true, 'screen')}

        {this.header(Lang('settings_edit_title_account'))}
        {this.option('/settings/password', 'key', Lang('settings_edit_password'))}
        {this.getLogoutButton()}

        <Button
          transparent
          danger
          block
          onPress={() => this.props.onNavigate('/settings/delete')}>
          <Text>{Lang('settings_deleteAccount_button')}</Text>
        </Button>
      </View>
    );
  }

  getClientSettings = () => (
    <List style={{backgroundColor: 'white'}}>
      {this.header(Lang('settings_edit_title_profile'), true)}
      {this.option('/settings/profile', 'person', Lang('settings_edit_profile'))}

      {this.header(Lang('settings_edit_title_payments'))}
      {this.option('/settings/cards', 'card', Lang('settings_edit_cards'))}
      {this.option('/settings/payments', 'calculator', Lang('settings_edit_payments'), true)}

      {this.getCommonSettings()}
    </List>
  );

  getBarberSettings = () => (
    <List style={{backgroundColor: 'white'}}>
      {this.header(Lang('settings_edit_title_profile'), true)}
      {this.option('/settings/profile', 'person', Lang('settings_edit_profile'))}
      {this.option('/settings/gallery', 'camera', Lang('settings_edit_gallery'))}
      {this.option('/settings/address', 'map', Lang('settings_edit_address'))}
      {this.option('/settings/profile/preview', 'eye', Lang('settings_edit_preview'), true)}

      {this.header(Lang('settings_edit_title_shop'))}
      {this.option('/settings/services', 'list', Lang('settings_edit_services'))}
      {this.option('/settings/schedule', 'clock', Lang('settings_edit_hours'), true)}


      {this.header(Lang('settings_edit_title_payments'))}
      {!this.state.user.authorization && this.option(`https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=${Stripe.clientId}&scope=read_write&state=${this.state.user.id}`, 'card', Lang('settings_connect_stripe'), false, 'url')}
      {this.option('/settings/payout/methods', 'card', Lang('settings_edit_payout_methods'))}

      {this.getCommonSettings()}
    </List>
  );

  // Generate list headers
  header = (label: string, first: boolean = false) => (
    <ListItem itemHeader first={first}>
      <Text>{label}</Text>
    </ListItem>
  );

  // Generate list items
  option = (path: string, icon: string, label: string, last: boolean = false, pathType: string = 'screen') => (
    <ListItem last={last} icon button onPress={() => {
      switch(pathType){
        case 'screen':
          this.props.onNavigate(path);
          break;
        case 'url':
          this.setState({uri: path, browserVisible: true, title: label})
          break;
        case 'email':
          Linking.openURL(path);
          break;

      }
    }}>
      <Left><Icon name={icon}/></Left>
      <Body><Text>{label}</Text></Body>
    </ListItem>
  );

  // Generate logout button
  getLogoutButton = () => (
    <ListItem last icon button onPress={this.logoutNativeApp}>
      <Left><Icon name="exit"/></Left>
      <Body><Text style={Styles.dangerColor}>{Lang('action_logout')}</Text></Body>
    </ListItem>
  );

  onBrowserClose = () => {
    this.setState({browserVisible: false})
  }
}
