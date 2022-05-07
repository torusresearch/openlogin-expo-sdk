import { Network } from "./types/Network";
import { LoginProvider } from "./types/LoginProvider";
import { Base64 } from "js-base64";
import { State } from "./types/State";
import { URL } from "react-native-url-polyfill";
import { IWebBrowser } from "./types/IWebBrowser";
import { SdkInitParams, SdkLoginParams, SdkLogoutParams } from "./types/sdk";

class OpenLogin {
  initParams: SdkInitParams;
  webBrowser: IWebBrowser;
  constructor(webBrowser: IWebBrowser, initParams: SdkInitParams) {
    this.initParams = initParams;
    if (!initParams.sdkUrl) {
      this.initParams.sdkUrl = new URL("https://sdk.openlogin.com");
    }
    this.webBrowser = webBrowser;
  }

  private async request(
    path: string,
    params: Record<string, any> = {},
    redirectUrl: string
  ) {
    const initParams = {
      ...this.initParams,
      clientId: this.initParams.clientId,
      network: this.initParams.network,
      ...(!!this.initParams.redirectUrl && {
        redirectUrl: this.initParams.redirectUrl,
      }),
    };

    const mergedParams = {
      init: initParams,
      params: {
        ...params,
        ...(!params.redirectUrl && { redirectUrl: redirectUrl }),
      },
    };

    console.log(`[OpenLogin] params passed to OpenLogin: ${mergedParams}`);

    const hash = Base64.encodeURI(JSON.stringify(mergedParams));

    const url = new URL(this.initParams.sdkUrl.href);
    url.pathname = url.pathname + `${path}`;
    url.hash = hash;

    console.log(
      `[OpenLogin] opening login screen in browser at ${url.href}, will redirect to ${redirectUrl}`
    );

    return await this.webBrowser.openAuthSessionAsync(url.href, redirectUrl);
  }

  async login(options: SdkLoginParams): Promise<State> {
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

  async logout(options: SdkLogoutParams): Promise<void> {
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
