/* global Symbol */
import { assignIn } from 'lodash';
import Promise from 'pinkie';
import promisifyEvent from 'promisify-event';
import BrowserConnection from '../connection';
import WARNING_MESSAGE from '../../warnings/message';


const name = Symbol();

export default class BrowserProviderPluginHost {
    constructor (providerObject, providerName) {
        assignIn(this, providerObject);

        this[name] = providerName;
    }


    // Helpers
    runInitScript (id, code) {
        var connection = BrowserConnection.getById(id);

        return connection.runInitScript(`(${code})()`);
    }

    waitForConnectionReady (id) {
        var connection = BrowserConnection.getById(id);

        if (connection.ready)
            return Promise.resolve();

        return promisifyEvent(connection, 'ready');
    }

    reportWarning (id, ...args) {
        var connection = BrowserConnection.getById(id);

        connection.addWarning(...args);
    }

    setUserAgentMetaInfo (id, message) {
        var connection = BrowserConnection.getById(id);

        connection.setProviderMetaInfo(message);
    }

    // API
    // Required
    // Browser control
    async openBrowser (/* id, browserInfo, startPage */) {
        throw new Error('Not implemented!');
    }

    async closeBrowser (/* id, pageInfo */) {
        throw new Error('Not implemented!');
    }


    // Optional
    // Initialization
    async init () {
        return;
    }

    async dispose () {
        return;
    }


    // Browser names handling
    async listAvailableOptionalBrowserNames () {
        throw new Error('Not implemented!');
    }

    async isValidBrowserName (/* browserName */) {
        return true;
    }

    // Extra functions
    async resizeWindow (/* id, pageInfo, width, height */) {
        this.reportWarning(WARNING_MESSAGE.resizeNotSupportedByBrowserProvider, this[name]);
    }

    async takeScreenshot (/* id, pageInfo, screenshotPath */) {
        this.reportWarning(WARNING_MESSAGE.screenshotNotSupportedByBrowserProvider, this[name]);
    }
}