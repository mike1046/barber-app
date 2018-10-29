// @flow
import { NavigationActions } from 'react-navigation';
import type { NavigationProp, NavigationRouter } from 'react-navigation';
import type { NavigatorServiceInterface } from '../clypr-shared/models/utils';

// Represents a history object for usage on entire app
let NativeNavigation: NavigationProp;
let NativeRouter: NavigationRouter;

// Records all screens which needs mediation to actions on navigation header bar
const _screens = {};

/** Helps with navigation on native app. */
export class NavigationService implements NavigatorServiceInterface {

  // Use browser APIs to handle history
  static initializeBrowserHistory() {}

  // Use alternative APIs to handle history
  static initializeNativeHistory(navigation: ?NavigationProp, router: ?NavigationRouter) {
    if (navigation) { NativeNavigation = navigation; }
    if (router) { NativeRouter = router; }
  }

  static goTo(path: string, params?: ?Object, replace?: boolean) {
    const navigateAction = NativeRouter.getActionForPathAndParams(path);
    if (params) { navigateAction.params = params; }

    NativeNavigation.dispatch(navigateAction);
  }

  static goToRoute(routeName: string, params: Object = {}, resetStack: boolean = false) {
    // Just navigate to a screen by its key
    let action = NavigationActions.navigate({ routeName, params });
    
    if (resetStack) {
      // Reset stack and then apply navigation
      action = NavigationActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'Initial' }),
          action
        ]
      });
    }

    // Apply navigation
    NativeNavigation.dispatch(action);
  }

  static goBack() {
    NativeNavigation.dispatch(NavigationActions.back());
  }

  // Connect actions from screens to buttons outside it, usually in the navigator header
  static registerScreenInstance(routePath: string, instance: any) {
    _screens[routePath] = instance;
  }

  // Execute an external action on a registered screen
  static screenAction(routePath: string, method: string) {
    return () => {
      const screen = _screens[routePath];
      if (screen && screen[method]) { screen[method](); }
    };
  }

}