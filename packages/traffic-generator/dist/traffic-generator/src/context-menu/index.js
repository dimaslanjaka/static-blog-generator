/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
var tslib_1 = require("tslib");
var electron = require("electron");
var cliTruncate = require("cli-truncate");
var download = require("electron-dl").download;
var isDev = require("electron-is-dev");
var webContents = function (win) { return win.webContents || (win.id && win); };
var decorateMenuItem = function (menuItem) {
    return function (options) {
        if (options === void 0) { options = {}; }
        if (options.transform && !options.click) {
            menuItem.transform = options.transform;
        }
        return menuItem;
    };
};
var defaultActions = {
    separator: function () { return ({ type: "separator" }); },
    learnSpelling: decorateMenuItem({
        id: "learnSpelling",
        label: "&Learn Spelling",
        visible: Boolean(props.isEditable && hasText && props.misspelledWord),
        click: function () {
            var target = webContents(win);
            target.session.addWordToSpellCheckerDictionary(props.misspelledWord);
        }
    }),
    lookUpSelection: decorateMenuItem({
        id: "lookUpSelection",
        label: "Look Up “{selection}”",
        visible: process.platform === "darwin" && hasText && !isLink,
        click: function () {
            if (process.platform === "darwin") {
                webContents(win).showDefinitionForSelection();
            }
        }
    }),
    searchWithGoogle: decorateMenuItem({
        id: "searchWithGoogle",
        label: "&Search with Google",
        visible: hasText,
        click: function () {
            var url = new URL("https://www.google.com/search");
            url.searchParams.set("q", props.selectionText);
            electron.shell.openExternal(url.toString());
        }
    }),
    cut: decorateMenuItem({
        id: "cut",
        label: "Cu&t",
        enabled: can("Cut"),
        visible: props.isEditable,
        click: function (menuItem) {
            var target = webContents(win);
            if (!menuItem.transform && target) {
                target.cut();
            }
            else {
                props.selectionText = menuItem.transform
                    ? menuItem.transform(props.selectionText)
                    : props.selectionText;
                electron.clipboard.writeText(props.selectionText);
            }
        }
    }),
    copy: decorateMenuItem({
        id: "copy",
        label: "&Copy",
        enabled: can("Copy"),
        visible: props.isEditable || hasText,
        click: function (menuItem) {
            var target = webContents(win);
            if (!menuItem.transform && target) {
                target.copy();
            }
            else {
                props.selectionText = menuItem.transform
                    ? menuItem.transform(props.selectionText)
                    : props.selectionText;
                electron.clipboard.writeText(props.selectionText);
            }
        }
    }),
    paste: decorateMenuItem({
        id: "paste",
        label: "&Paste",
        enabled: editFlags.canPaste,
        visible: props.isEditable,
        click: function (menuItem) {
            var target = webContents(win);
            if (menuItem.transform) {
                var clipboardContent = electron.clipboard.readText(props.selectionText);
                clipboardContent = menuItem.transform
                    ? menuItem.transform(clipboardContent)
                    : clipboardContent;
                target.insertText(clipboardContent);
            }
            else {
                target.paste();
            }
        }
    }),
    saveImage: decorateMenuItem({
        id: "saveImage",
        label: "Save I&mage",
        visible: props.mediaType === "image",
        click: function (menuItem) {
            props.srcURL = menuItem.transform
                ? menuItem.transform(props.srcURL)
                : props.srcURL;
            download(win, props.srcURL);
        }
    }),
    saveImageAs: decorateMenuItem({
        id: "saveImageAs",
        label: "Sa&ve Image As…",
        visible: props.mediaType === "image",
        click: function (menuItem) {
            props.srcURL = menuItem.transform
                ? menuItem.transform(props.srcURL)
                : props.srcURL;
            download(win, props.srcURL, { saveAs: true });
        }
    }),
    copyLink: decorateMenuItem({
        id: "copyLink",
        label: "Copy Lin&k",
        visible: props.linkURL.length > 0 && props.mediaType === "none",
        click: function (menuItem) {
            props.linkURL = menuItem.transform
                ? menuItem.transform(props.linkURL)
                : props.linkURL;
            electron.clipboard.write({
                bookmark: props.linkText,
                text: props.linkURL
            });
        }
    }),
    saveLinkAs: decorateMenuItem({
        id: "saveLinkAs",
        label: "Save Link As…",
        visible: props.linkURL.length > 0 && props.mediaType === "none",
        click: function (menuItem) {
            props.linkURL = menuItem.transform
                ? menuItem.transform(props.linkURL)
                : props.linkURL;
            download(win, props.linkURL, { saveAs: true });
        }
    }),
    copyImage: decorateMenuItem({
        id: "copyImage",
        label: "Cop&y Image",
        visible: props.mediaType === "image",
        click: function () {
            webContents(win).copyImageAt(props.x, props.y);
        }
    }),
    copyImageAddress: decorateMenuItem({
        id: "copyImageAddress",
        label: "C&opy Image Address",
        visible: props.mediaType === "image",
        click: function (menuItem) {
            props.srcURL = menuItem.transform
                ? menuItem.transform(props.srcURL)
                : props.srcURL;
            electron.clipboard.write({
                bookmark: props.srcURL,
                text: props.srcURL
            });
        }
    }),
    inspect: function () { return ({
        id: "inspect",
        label: "I&nspect Element",
        click: function () {
            win.inspectElement(props.x, props.y);
            if (webContents(win).isDevToolsOpened()) {
                webContents(win).devToolsWebContents.focus();
            }
        }
    }); },
    services: function () { return ({
        id: "services",
        label: "Services",
        role: "services",
        visible: process.platform === "darwin" && (props.isEditable || hasText)
    }); }
};
var removeUnusedMenuItems = function (menuTemplate) {
    var notDeletedPreviousElement;
    return menuTemplate
        .filter(function (menuItem) {
        return menuItem !== undefined &&
            menuItem !== false &&
            menuItem.visible !== false &&
            menuItem.visible !== "";
    })
        .filter(function (menuItem, index, array) {
        var toDelete = menuItem.type === "separator" &&
            (!notDeletedPreviousElement ||
                index === array.length - 1 ||
                array[index + 1].type === "separator");
        notDeletedPreviousElement = toDelete
            ? notDeletedPreviousElement
            : menuItem;
        return !toDelete;
    });
};
var create = function (win, options) {
    var handleContextMenu = function (event, props) {
        if (typeof options.shouldShowMenu === "function" &&
            options.shouldShowMenu(event, props) === false) {
            return;
        }
        var editFlags = props.editFlags;
        var hasText = props.selectionText.trim().length > 0;
        var isLink = Boolean(props.linkURL);
        var can = function (type) { return editFlags["can".concat(type)] && hasText; };
        var shouldShowInspectElement = typeof options.showInspectElement === "boolean"
            ? options.showInspectElement
            : isDev;
        function word(suggestion) {
            return {
                id: "dictionarySuggestions",
                label: suggestion,
                visible: Boolean(props.isEditable && hasText && props.misspelledWord),
                click: function (menuItem) {
                    var target = webContents(win);
                    target.replaceMisspelling(menuItem.label);
                }
            };
        }
        var dictionarySuggestions = [];
        if (hasText &&
            props.misspelledWord &&
            props.dictionarySuggestions.length > 0) {
            dictionarySuggestions = props.dictionarySuggestions.map(function (suggestion) {
                return word(suggestion);
            });
        }
        else {
            dictionarySuggestions.push({
                id: "dictionarySuggestions",
                label: "No Guesses Found",
                visible: Boolean(hasText && props.misspelledWord),
                enabled: false
            });
        }
        var menuTemplate = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([
            dictionarySuggestions.length > 0 && defaultActions.separator()
        ], dictionarySuggestions, true), [
            defaultActions.separator(),
            defaultActions.learnSpelling(),
            defaultActions.separator(),
            options.showLookUpSelection !== false && defaultActions.lookUpSelection(),
            defaultActions.separator(),
            options.showSearchWithGoogle !== false &&
                defaultActions.searchWithGoogle(),
            defaultActions.separator(),
            defaultActions.cut(),
            defaultActions.copy(),
            defaultActions.paste(),
            defaultActions.separator(),
            options.showSaveImage && defaultActions.saveImage(),
            options.showSaveImageAs && defaultActions.saveImageAs(),
            options.showCopyImage !== false && defaultActions.copyImage(),
            options.showCopyImageAddress && defaultActions.copyImageAddress(),
            defaultActions.separator(),
            defaultActions.copyLink(),
            options.showSaveLinkAs && defaultActions.saveLinkAs(),
            defaultActions.separator(),
            shouldShowInspectElement && defaultActions.inspect(),
            options.showServices && defaultActions.services(),
            defaultActions.separator()
        ], false);
        if (options.menu) {
            menuTemplate = options.menu(defaultActions, props, win, dictionarySuggestions, event);
        }
        if (options.prepend) {
            var result = options.prepend(defaultActions, props, win, event);
            if (Array.isArray(result)) {
                menuTemplate.unshift.apply(menuTemplate, result);
            }
        }
        if (options.append) {
            var result = options.append(defaultActions, props, win, event);
            if (Array.isArray(result)) {
                menuTemplate.push.apply(menuTemplate, result);
            }
        }
        // Filter out leading/trailing separators
        // TODO: https://github.com/electron/electron/issues/5869
        menuTemplate = removeUnusedMenuItems(menuTemplate);
        for (var _i = 0, menuTemplate_1 = menuTemplate; _i < menuTemplate_1.length; _i++) {
            var menuItem = menuTemplate_1[_i];
            // Apply custom labels for default menu items
            if (options.labels && options.labels[menuItem.id]) {
                menuItem.label = options.labels[menuItem.id];
            }
            // Replace placeholders in menu item labels
            if (typeof menuItem.label === "string" &&
                menuItem.label.includes("{selection}")) {
                var selectionString = typeof props.selectionText === "string"
                    ? props.selectionText.trim()
                    : "";
                menuItem.label = menuItem.label.replace("{selection}", cliTruncate(selectionString, 25).replace(/&/g, "&&"));
            }
        }
        if (menuTemplate.length > 0) {
            var menu = electron.Menu.buildFromTemplate(menuTemplate);
            menu.popup(win);
        }
    };
    webContents(win).on("context-menu", handleContextMenu);
    return function () {
        if (win.isDestroyed()) {
            return;
        }
        webContents(win).removeListener("context-menu", handleContextMenu);
    };
};
module.exports = {
    defaultActions: defaultActions
};
module.exports = function (options) {
    if (options === void 0) { options = {}; }
    if (process.type === "renderer") {
        throw new Error("Cannot use electron-context-menu in the renderer process!");
    }
    var isDisposed = false;
    var disposables = [];
    var init = function (win) {
        if (isDisposed) {
            return;
        }
        var disposeMenu = create(win, options);
        disposables.push(disposeMenu);
        var removeDisposable = function () {
            var index = disposables.indexOf(disposeMenu);
            if (index !== -1) {
                disposables.splice(index, 1);
            }
        };
        if (typeof win.once !== "undefined") {
            // Support for BrowserView
            win.once("closed", removeDisposable);
        }
        disposables.push(function () {
            win.off("closed", removeDisposable);
        });
    };
    var dispose = function () {
        for (var _i = 0, disposables_1 = disposables; _i < disposables_1.length; _i++) {
            var dispose_1 = disposables_1[_i];
            dispose_1();
        }
        disposables.length = 0;
        isDisposed = true;
    };
    if (options.window) {
        var win_1 = options.window;
        // When window is a webview that has not yet finished loading webContents is not available
        if (webContents(win_1) === undefined) {
            var onDomReady_1 = function () {
                init(win_1);
            };
            var listenerFunction = win_1.addEventListener || win_1.addListener;
            listenerFunction("dom-ready", onDomReady_1, { once: true });
            disposables.push(function () {
                win_1.removeEventListener("dom-ready", onDomReady_1, { once: true });
            });
            return dispose;
        }
        init(win_1);
        return dispose;
    }
    for (var _i = 0, _a = electron.BrowserWindow.getAllWindows(); _i < _a.length; _i++) {
        var win = _a[_i];
        init(win);
    }
    var onWindowCreated = function (event, win) {
        init(win);
    };
    electron.app.on("browser-window-created", onWindowCreated);
    disposables.push(function () {
        electron.app.removeListener("browser-window-created", onWindowCreated);
    });
    return dispose;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29udGV4dC1tZW51L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZCQUE2QjtBQUM3Qix1REFBdUQ7QUFDdkQsWUFBWSxDQUFDOztBQUNiLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsSUFBQSxRQUFRLEdBQUssT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUEzQixDQUE0QjtBQUM1QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUV6QyxJQUFNLFdBQVcsR0FBRyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsQ0FBQyxXQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDO0FBRWhFLElBQU0sZ0JBQWdCLEdBQUcsVUFBQyxRQUFRO0lBQ2hDLE9BQU8sVUFBQyxPQUFZO1FBQVosd0JBQUEsRUFBQSxZQUFZO1FBQ2xCLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDdkMsUUFBUSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBQ0YsSUFBTSxjQUFjLEdBQUc7SUFDckIsU0FBUyxFQUFFLGNBQU0sT0FBQSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQXZCLENBQXVCO0lBQ3hDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQztRQUM5QixFQUFFLEVBQUUsZUFBZTtRQUNuQixLQUFLLEVBQUUsaUJBQWlCO1FBQ3hCLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxD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