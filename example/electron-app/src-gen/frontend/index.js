// @ts-check

require('reflect-metadata');
require('setimmediate');
const { Container } = require('inversify');
const { FrontendApplicationConfigProvider } = require('@theia/core/lib/browser/frontend-application-config-provider');

FrontendApplicationConfigProvider.set({
    "applicationName": "Eclipse Theia",
    "defaultTheme": "dark",
    "defaultIconTheme": "none",
    "electron": {
        "disallowReloadKeybinding": false,
        "windowOptions": {}
    }
});

const { ThemeService } = require('@theia/core/lib/browser/theming');
ThemeService.get().loadUserTheme();

const nls = require('@theia/core/lib/browser/nls-loader');

// nls translations MUST be loaded before requiring any code that uses them
module.exports = nls.loadTranslations().then(() => {
    const { FrontendApplication } = require('@theia/core/lib/browser');
    const { frontendApplicationModule } = require('@theia/core/lib/browser/frontend-application-module');
    const { messagingFrontendModule } = require('@theia/core/lib/electron-browser/messaging/electron-messaging-frontend-module');
    const { loggerFrontendModule } = require('@theia/core/lib/browser/logger-frontend-module');

    const container = new Container();
    container.load(frontendApplicationModule);
    container.load(messagingFrontendModule);
    container.load(loggerFrontendModule);

    return Promise.resolve()
    .then(function () { return import('@theia/core/lib/browser/i18n/i18n-frontend-module').then(load) })
    .then(function () { return import('@theia/core/lib/electron-browser/menu/electron-menu-module').then(load) })
    .then(function () { return import('@theia/core/lib/electron-browser/window/electron-window-module').then(load) })
    .then(function () { return import('@theia/core/lib/electron-browser/keyboard/electron-keyboard-module').then(load) })
    .then(function () { return import('@theia/core/lib/electron-browser/token/electron-token-frontend-module').then(load) })
    .then(function () { return import('@theia/variable-resolver/lib/browser/variable-resolver-frontend-module').then(load) })
    .then(function () { return import('@theia/editor/lib/browser/editor-frontend-module').then(load) })
    .then(function () { return import('@theia/filesystem/lib/browser/filesystem-frontend-module').then(load) })
    .then(function () { return import('@theia/filesystem/lib/browser/download/file-download-frontend-module').then(load) })
    .then(function () { return import('@theia/filesystem/lib/electron-browser/file-dialog/electron-file-dialog-module').then(load) })
    .then(function () { return import('@theia/workspace/lib/browser/workspace-frontend-module').then(load) })
    .then(function () { return import('@theia/navigator/lib/browser/navigator-frontend-module').then(load) })
    .then(function () { return import('@theia/markers/lib/browser/problem/problem-frontend-module').then(load) })
    .then(function () { return import('@theia/outline-view/lib/browser/outline-view-frontend-module').then(load) })
    .then(function () { return import('@theia/monaco/lib/electron-browser/monaco-electron-module').then(load) })
    .then(function () { return import('@theia/console/lib/browser/console-frontend-module').then(load) })
    .then(function () { return import('@theia/output/lib/browser/output-frontend-module').then(load) })
    .then(function () { return import('@theia/userstorage/lib/browser/user-storage-frontend-module').then(load) })
    .then(function () { return import('@theia/preferences/lib/browser/preference-frontend-module').then(load) })
    .then(function () { return import('@theia/process/lib/common/process-common-module').then(load) })
    .then(function () { return import('@theia/terminal/lib/browser/terminal-frontend-module').then(load) })
    .then(function () { return import('@theia/task/lib/browser/task-frontend-module').then(load) })
    .then(function () { return import('@theia/debug/lib/browser/debug-frontend-module').then(load) })
    .then(function () { return import('@theia/file-search/lib/browser/file-search-frontend-module').then(load) })
    .then(function () { return import('@theia/keymaps/lib/browser/keymaps-frontend-module').then(load) })
    .then(function () { return import('@theia/getting-started/lib/browser/getting-started-frontend-module').then(load) })
    .then(function () { return import('@theia/messages/lib/browser/messages-frontend-module').then(load) })
    .then(function () { return import('@theia/callhierarchy/lib/browser/callhierarchy-frontend-module').then(load) })
    .then(function () { return import('@theia/bulk-edit/lib/browser/bulk-edit-frontend-module').then(load) })
    .then(function () { return import('@theia/scm/lib/browser/scm-frontend-module').then(load) })
    .then(function () { return import('@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-module').then(load) })
    .then(function () { return import('@theia/timeline/lib/browser/timeline-frontend-module').then(load) })
    .then(function () { return import('@theia/plugin-ext/lib/plugin-ext-frontend-module').then(load) })
    .then(function () { return import('@theia/plugin-ext/lib/plugin-ext-frontend-electron-module').then(load) })
    .then(function () { return import('@theia/plugin-ext-vscode/lib/browser/plugin-vscode-frontend-module').then(load) })
    .then(function () { return import('@theia/property-view/lib/browser/property-view-frontend-module').then(load) })
    .then(function () { return import('@theia/vsx-registry/lib/browser/vsx-registry-frontend-module').then(load) })
    .then(function () { return import('theia-hello-world-extension/lib/browser/frontend-module').then(load) })
        .then(start).catch(reason => {
            console.error('Failed to start the frontend application.');
            if (reason) {
                console.error(reason);
            }
        });

    function load(jsModule) {
        return Promise.resolve(jsModule.default)
            .then(containerModule => container.load(containerModule));
    }

    function start() {
        (window['theia'] = window['theia'] || {}).container = container;
        return container.get(FrontendApplication).start();
    }
});
