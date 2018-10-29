package net.clypr.app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.gettipsi.stripe.StripeReactPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new StripeReactPackage(),
            new RNFirebasePackage(),
            new ReactNativeConfigPackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebaseStoragePackage(),
            new RNFirebaseRemoteConfigPackage(),
            new RNFirebaseLinksPackage(),
            new RNFirebaseCrashlyticsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
