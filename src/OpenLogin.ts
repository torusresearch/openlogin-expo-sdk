import * as WebBrowser from "expo-web-browser";
import { Network } from "./Network";
import { LoginProvider } from "./LoginProvider";
import { TextEncoder } from "util";
import { Base64 } from "js-base64";
import Constants from "expo-constants";
import { constants } from "buffer";
import { url } from "inspector";
import { State } from "./State";
import { URL } from "react-native-url-polyfill";

interface InitParams {
  clientId: string;
  network: Network;
  redirectUrl?: URL;
  sdkUrl?: URL;
}

interface LoginOptions {
  loginProvider: LoginProvider;
  fastLogin?: boolean;
  relogin?: boolean;
  skipTKey?: boolean;
  extraLoginOptions?: Record<string, any>;
  redirectUrl?: URL;
  appState?: string;
}

interface LogoutOptions {
  fastLogin?: boolean;
  redirectUrl?: URL;
  appState?: string;
}

class OpenLogin {
  initParams: InitParams;
  constructor(initParams: InitParams) {
    this.initParams = initParams;
    if (!initParams.sdkUrl) {
      this.initParams.sdkUrl = new URL("https://sdk.openlogin.com");
    }
  }

  private async request(
    path: string,
    params: Record<string, any> = {},
    redirectUrl: URL = new URL(Constants.linkingUri)
  ) {
    const initParams = {
      clientId: this.initParams.clientId,
      network: this.initParams.network,
      ...(!!this.initParams.redirectUrl && {
        redirectUrl: this.initParams.redirectUrl.href,
      }),
    };

    const mergedParams = {
      init: initParams,
      params: params,
    };

    const hash = Base64.encodeURI(JSON.stringify(mergedParams));

    const url = new URL(this.initParams.sdkUrl.href);
    url.pathname = url.pathname + `/${path}`;
    url.hash = hash;

    console.log(
      `[OpenLogin] opening login screen in browser at ${url.href}, will redirect to ${redirectUrl.href}`
    );

    return await WebBrowser.openAuthSessionAsync(url.href, redirectUrl.href);
  }

  async login(options: LoginOptions): Promise<State> {
    const result = await this.request("login", options, options.redirectUrl);
    if (result.type != "success" || !result.url) {
      console.log(
        `[OpenLogin] login flow failed with error type ${result.type}`
      );
      throw new Error(`login flow failed with error type ${result.type}`);
    }

    const fragment = new URL(result.url).hash;
    const decodedPayload = Base64.decode(fragment);
    const state = JSON.parse(decodedPayload);
    return state;
  }

  async logout(options: LogoutOptions): Promise<void> {
    const result = await this.request("logout", options, options.redirectUrl);
    if (result.type != "success" || !result.url) {
      console.log(
        `[OpenLogin] logout flow failed with error type ${result.type}`
      );
      throw new Error(`logout flow failed with error type ${result.type}`);
    }
  }
}

export default OpenLogin;
