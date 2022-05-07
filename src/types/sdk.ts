import {
  BaseLogoutParams,
  BaseRedirectParams,
  LoginParams,
  OpenLoginOptions,
} from "./core";
import { URL } from "react-native-url-polyfill";

type SdkSpecificInitParams = {
  sdkUrl: URL;
};

export type SdkInitParams = Omit<
  OpenLoginOptions & SdkSpecificInitParams,
  | "no3PC"
  | "uxMode"
  | "replaceUrlOnRedirect"
  | "originData"
  | "_iframeUrl"
  | "_startUrl"
  | "_popupUrl"
>;

export type SdkLoginParams = Omit<
  LoginParams,
  "fastLogin" | "skipTKey" | "getWalletKey"
>;

export type SdkLogoutParams = Partial<BaseLogoutParams> &
  Partial<BaseRedirectParams>;
