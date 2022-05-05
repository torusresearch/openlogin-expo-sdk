import { Network } from "./Network";
import { LoginProvider } from "./LoginProvider";
import { State } from "./State";
import { URL } from "react-native-url-polyfill";
import { IWebBrowser } from "./IWebBrowser";
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
declare class OpenLogin {
    initParams: InitParams;
    webBrowser: IWebBrowser;
    constructor(webBrowser: IWebBrowser, initParams: InitParams);
    private request;
    login(options: LoginOptions): Promise<State>;
    logout(options: LogoutOptions): Promise<void>;
}
export default OpenLogin;
