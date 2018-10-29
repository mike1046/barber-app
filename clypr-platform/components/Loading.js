// @flow
import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import { Styles } from '../../styles/global';

export class Loading extends PureComponent {
  
  render() {
    return <ActivityIndicator style={Styles.loading} animating={true} size="large" />;
  }

}
