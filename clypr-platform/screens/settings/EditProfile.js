// @flow
// $FlowIgnoreExpoBug
import React, { Component } from 'react';
import { Text, Form, Item, Label, Input, Button, Spinner, Content } from 'native-base';
import { Image, TouchableHighlight, ScrollView } from 'react-native';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import { Alert } from '../../../services/alert';
import { Styles, Variables } from '../../../styles/global';
import { AccountService } from '../../../clypr-shared/services/account';
import { MediaService } from '../../../services/media';
import { Loading } from '../../components/Loading';

type Props = {
  role: ?Models.UserRole;
  profile: Models.UserProfile;
  onSave: (profile: Models.UserProfile) => void;
  isLoading: boolean;
};

interface State extends Models.UserProfile {
  isUploading: boolean;
  avatarPreviewData?: string;
};

/** Implements this screen for Native platform. */
export class EditProfileScreen extends Component {

  state: State;
  props: Props;
  _lastSelectedImageEncoded: string;

  constructor(props: Props) {
    super(props);

    // Use given profile as form's values
    const profile = this.props.profile;

    this.state = {
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      isUploading: false
    };
  }

  render() {
    if (this.state.isUploading || this.props.isLoading) { return <Loading />; }

    return (
      <Content extraHeight={150}>
        <TouchableHighlight onPress={this.pickImage}>
          <Image source={
            (this.state.avatarPreviewData && { uri: this.state.avatarPreviewData }) ||
            (this.props.profile && this.props.profile.avatarUrl && { uri: this.props.profile.avatarUrl}) ||
            require('../../../assets/avatar.png')
          } style={style.avatar} />
        </TouchableHighlight>

        <Form style={style.form}>
          <Item floatingLabel>
            <Label>{Lang('settings_edit_profile')}</Label>
            <Input style={Styles.input} onChangeText={name => this.setState({ name })} value={this.state.name} />
          </Item>
        </Form>

        <Button
          full
          style={Styles.submit}
          onPress={this.save}>
          <Text style={Styles.submitText}>{Lang('action_save')}</Text>
        </Button>

      </Content>
    );
  }

  pickImage = async () => {
    // Select a new avatar
    const image = await MediaService.pickDeviceMedia();
    if (image && image.success && image.base64 && image.urlHeader) {
      // Use this image
      this._lastSelectedImageEncoded = image.base64;

      // Preview image
      this.setState({ avatarPreviewData: image.urlHeader + image.base64 });
    }
  };

  upload = async () => {
    // Get current user uid
    const user = AccountService.getCurrentUser();
    const uid = user && user.id;

    if (uid && this._lastSelectedImageEncoded) {
      // Upload this image
      try {
        this.setState({ isUploading: true });
        const avatarUrl = await MediaService.getUploadedMediaUrl('avatar', this._lastSelectedImageEncoded);

        if (avatarUrl) {
          // Use this url
          this.setState({ isUploading: false });
          return avatarUrl;
        } else {
          this.setState({ isUploading: false });
          Alert.show(Lang('settings_edit_profile_error1'));
        }
      } catch (err) {
        this.setState({ isUploading: false });
        Alert.show(Lang('settings_edit_profile_error2') +': '+ JSON.stringify(err));
      }
    } else {
      Alert.show(Lang('account_error1'));
    }
  };

  save = async () => {
    // Maybe upload new image
    let avatarUrl = this.state.avatarUrl;
    if (this._lastSelectedImageEncoded) { avatarUrl = await this.upload(); }

    // Build new profile data
    const profile = {
      avatarUrl: avatarUrl || '',
      name: this.state.name
    };

    if (this.props.onSave) { this.props.onSave(profile); }
  };
}

const style = {

  form: {
    marginVertical: 20
  },

  avatar: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: 'black'
  }

};
