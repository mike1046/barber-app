// @flow
import React, {Component} from 'react';
import {ActivityIndicator, Image, ImageBackground, TouchableOpacity} from 'react-native';
import {Body, Button, Container, Content, Form, H1, Icon, Input, Item, Label, ListItem, Text, View} from 'native-base';

import Lang from '../../../clypr-shared/services/lang';
import {Variables} from '../../../styles/global';
import {TOS} from './TOS'

type Props = {
  isLoading: boolean;
  onLogin: (Object) => void;
  onRegister: (Object) => void;
  onRecover: (Object) => void;
};

type State = {
  mode: string;

  show_tos: boolean;

  login_email?: string;
  login_password?: string;

  register_name?: string;
  register_email?: string;
  register_password?: string;
  register_password2?: string;
  register_isBarber?: boolean;
  register_tos?: boolean;

  recovery_email?: string;
  recovery_code?: string;
  recovery_password?: string;
  recovery_password2?: string;
}

/** Implements Login screen for Web platform. */
export class LoginScreen extends Component {

  props: Props;
  state: State = {
    mode: 'menu',
    show_tos: false
  };

  render() {
    const registerDisabled = !this.state.register_tos

    return (
      <Container>
        <ImageBackground source={require('../../../assets/welcome1_dark-centered.jpg')} style={style.backgroundImage}>
          <View style={style.background}>
            <Image source={require('../../../assets/clypr-logo-white.png')} style={style.logo}/>

            {this.props.isLoading && (
              <ActivityIndicator style={style.loading} animating={true} size="large"/>
            )}

            {!this.props.isLoading && this.state.mode === 'login' && (
              <Content extraHeight={200}>
                <Form style={style.form}>
                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('login_email')}</Label>
                    <Input style={style.input}
                           onChangeText={login_email => this.setState({login_email})}
                           value={this.state.login_email}
                           autoCapitalize={'none'} autoCorrect={false}
                           keyboardType="email-address"/>
                  </Item>

                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('login_password')}</Label>
                    <Input secureTextEntry={true}
                           password={true}
                           style={style.input}
                           onChangeText={login_password => this.setState({login_password})}
                           value={this.state.login_password}/>
                  </Item>

                  <Button block onPress={this.login} style={style.submitButton}>
                    <Text>{Lang('login_submit')}</Text>
                  </Button>

                  <Button block transparent onPress={this.showRegister} style={style.navButton}>
                    <Text style={style.label}>{Lang('login_signup_button')}</Text>
                  </Button>

                  <Button block transparent onPress={this.showRecovery}>
                    <Text style={style.label}>{Lang('login_recovery_button')}</Text>
                  </Button>
                </Form>
              </Content>
            )}

            {!this.props.isLoading && this.state.mode === 'register' && (
              <Content extraHeight={200}>
                <Form style={style.form}>

                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('signup_names')}</Label>
                    <Input style={style.input}
                           onChangeText={register_name => this.setState({register_name})}
                           value={this.state.register_name}/>
                  </Item>

                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('signup_email')}</Label>
                    <Input style={style.input}
                           onChangeText={register_email => this.setState({register_email})}
                           value={this.state.register_email}
                           autoCapitalize={'none'}
                           autoCorrect={false}
                           keyboardType="email-address"/>
                  </Item>
                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('signup_password')}</Label>
                    <Input password={true}
                           secureTextEntry={true}
                           style={style.input}
                           onChangeText={register_password => this.setState({register_password})}
                           value={this.state.register_password}/>
                  </Item>

                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('signup_password_repeat')}</Label>
                    <Input password={true}
                           secureTextEntry={true}
                           style={style.input}
                           onChangeText={register_password2 => this.setState({register_password2})}
                           value={this.state.register_password2}/>
                  </Item>

                  <Item style={style.checkboxView}>
                    <Icon active={this.state.register_isBarber} onPress={this.toggleRegisterRole} style={style.checkbox}
                          name={'square'}/>
                    <Body style={style.checkboxBody}>
                    <Text onPress={this.toggleRegisterRole}
                          style={style.checkboxLabel}>{Lang('signup_role_checkbox')}</Text>
                    </Body>
                  </Item>

                  <Item style={style.checkboxView}>
                    <Icon active={this.state.register_tos} onPress={this.toggleAgreeWithTOS} style={style.checkbox}
                          name={'square'}/>
                    <Body style={[style.checkboxBody, {flexDirection: 'row'}]}>
                    <Text style={style.checkboxLabel}
                          onPress={this.toggleAgreeWithTOS}>{Lang('signup_agree_with_tos')}</Text>
                    <TouchableOpacity onPress={() => {
                      this.setState({show_tos: true})
                    }}>
                      <Text style={style.checkbox}>{Lang('signup_tos')}</Text>
                    </TouchableOpacity>
                    </Body>
                  </Item>

                  <View style={{height: 20}}/>

                  <Button block disabled={registerDisabled} onPress={this.register} style={style.submitButtonAlt}>
                    <Text>{Lang('signup_submit')}</Text>
                  </Button>

                  <Button block transparent onPress={this.showLogin} style={style.navButton}>
                    <Text style={style.label}>{Lang('login_alt_button')}</Text>
                  </Button>
                </Form>
              </Content>
            )}

            {!this.props.isLoading && this.state.mode === 'menu' && (
              <View style={style.menu}>
                <Button block onPress={this.showRegister} style={style.buttonSignup}>
                  <Text>{Lang('action_signup')}</Text>
                </Button>

                <Button block onPress={this.showLogin} style={style.buttonLogin}>
                  <Text>{Lang('action_login')}</Text>
                </Button>
              </View>
            )}


            {!this.props.isLoading && this.state.mode === 'recovery' && (
              <Content>
                <Form style={style.form}>
                  <Item floatingLabel>
                    <Label style={style.label}>{Lang('recovery_email')}</Label>
                    <Input style={style.input}
                           onChangeText={recovery_email => this.setState({recovery_email})}
                           value={this.state.recovery_email}
                           autoCapitalize={'none'}
                           autoCorrect={false}
                           keyboardType="email-address"/>
                  </Item>

                  <Button block onPress={this.recover} style={style.submitButton}>
                    <Text>{Lang('recovery_submit')}</Text>
                  </Button>

                  <Button block transparent onPress={this.showLogin} style={style.navButton}>
                    <Text style={style.label}>{Lang('login_alt2_button')}</Text>
                  </Button>
                </Form>
              </Content>
            )}
          </View>
        </ImageBackground>
        <TOS visible={this.state.show_tos}
             onClose={(accepted) => this.setState({show_tos: false, register_tos: accepted})}/>

      </Container>
    );
  }

  showLogin = () => {
    this.setState({mode: 'login'});
  };
  showRegister = () => {
    this.setState({mode: 'register'});
  };
  showRecovery = () => {
    this.setState({mode: 'recovery'});
  };

  toggleRegisterRole = () => {
    // Toogle isBarber value
    const register_isBarber = !this.state.register_isBarber;
    this.setState({register_isBarber});
  };

  toggleAgreeWithTOS = () => {
    const register_tos = !this.state.register_tos;
    this.setState({register_tos});
  };


  login = () => {
    const email = this.state.login_email;
    const password = this.state.login_password;

    this.props.onLogin({email, password});
  };

  register = () => {
    const email = this.state.register_email;
    const password = this.state.register_password;
    const name = this.state.register_name;
    const role = this.state.register_isBarber ? 'barber' : 'client';

    this.props.onRegister({email, password, name, role});
  };

  recover = () => {
    const email = this.state.recovery_email;
    this.props.onRecover({email});
    this.showLogin();
  }
}

const style = {

  backgroundImage: {
    width: '100%',
    height: '100%',
  },

  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5
  },

  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },

  menu: {
    flexDirection: 'row',
    marginBottom: 40
  },

  button: {
    flex: 1,
    marginHorizontal: 5
  },
  buttonSignup: {},
  buttonLogin: {},

  form: {
    flex: 1,
    margin: 20,
    marginLeft: 5
  },

  input: {
    color: 'white',
    marginLeft: 0
  },

  label: {
    color: Variables.primaryLightColor
  },

  navButton: {
    marginTop: 40
  },

  submitButton: {
    marginTop: 30,
    marginLeft: 15
  },

  submitButtonAlt: {
    marginTop: 0
  },

  checkboxView: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    marginTop: 20
  },

  checkboxLabel: {
    color: 'white',
  },

  checkboxBody: {
    flex: 0
  },

  checkbox: {
    color: Variables.primaryColor
  }

};

style.buttonSignup = Object.assign({}, style.button, {
  backgroundColor: Variables.primaryColorTransparent
});

style.buttonLogin = Object.assign({}, style.button, {
  backgroundColor: 'rgba(0, 0, 0, 0.8)'
});
