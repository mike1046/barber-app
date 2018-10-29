// @flow
import { Alert as NativeAlert } from 'react-native';

/** Show and confirm information in a specific platform. */
export class Alert {

  static show(text: string) {
    alert(text);
  }

  static confirm(title: string, text: string, cancelText: string, confirmText: string, onCancel, onConfirm) {
    NativeAlert.alert(title, text, [
      { text: cancelText, onPress: onCancel },
      { text: confirmText, onPress: onConfirm },
    ]);
  }

}
