import * as WebBrowser from "expo-web-browser";
import { Network } from "./Network";

interface InitParams {
  clientId: string;
  network: Network;
  redirectUrl: string;
}

class OpenLogin {
  constructor(initParams: InitParams) {}
}

export default OpenLogin;
