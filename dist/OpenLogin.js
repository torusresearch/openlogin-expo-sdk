import { Base64 } from "js-base64";
import { URL } from "react-native-url-polyfill";
class OpenLogin {
    initParams;
    webBrowser;
    constructor(webBrowser, initParams) {
        this.initParams = initParams;
        if (!initParams.sdkUrl) {
            this.initParams.sdkUrl = new URL("https://sdk.openlogin.com");
        }
        this.webBrowser = webBrowser;
    }
    async request(path, params = {}, redirectUrl) {
        const initParams = {
            ...this.initParams,
            clientId: this.initParams.clientId,
            network: this.initParams.network,
            ...(!!this.initParams.redirectUrl && {
                redirectUrl: this.initParams.redirectUrl.href,
            }),
        };
        const mergedParams = {
            init: initParams,
            params: {
                ...params,
                ...(!params.redirectUrl && { redirectUrl: redirectUrl.href }),
            },
        };
        console.log(`[OpenLogin] params passed to OpenLogin: ${mergedParams}`);
        const hash = Base64.encodeURI(JSON.stringify(mergedParams));
        const url = new URL(this.initParams.sdkUrl.href);
        url.pathname = url.pathname + `${path}`;
        url.hash = hash;
        console.log(`[OpenLogin] opening login screen in browser at ${url.href}, will redirect to ${redirectUrl.href}`);
        return await this.webBrowser.openAuthSessionAsync(url.href, redirectUrl.href);
    }
    async login(options) {
        const result = await this.request("login", options, options.redirectUrl);
        if (result.type != "success" || !result.url) {
            console.log(`[OpenLogin] login flow failed with error type ${result.type}`);
            throw new Error(`login flow failed with error type ${result.type}`);
        }
        const fragment = new URL(result.url).hash;
        const decodedPayload = Base64.decode(fragment);
        const state = JSON.parse(decodedPayload);
        return state;
    }
    async logout(options) {
        const result = await this.request("logout", options, options.redirectUrl);
        if (result.type != "success" || !result.url) {
            console.log(`[OpenLogin] logout flow failed with error type ${result.type}`);
            throw new Error(`logout flow failed with error type ${result.type}`);
        }
    }
}
export default OpenLogin;
//# sourceMappingURL=OpenLogin.js.map