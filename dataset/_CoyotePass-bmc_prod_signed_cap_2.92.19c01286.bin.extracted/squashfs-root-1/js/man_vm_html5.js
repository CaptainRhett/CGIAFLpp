"use strict";

// FIXME: Dirty global variable
let vm = null;
let vmdebug = false;
const MAX_DEVICE_NUMBER = 3;
const ONE_SEC_MS = 1000;
const MEDIA_TYPE = {
    FOLDER: 0x01,
    ISO: 0x03,
    IMG: 0x05,
    NONE: 0xFF
};
var lang = window.opener.lang;

class Tabs {
    constructor(attribute, container) {
        this.attr = attribute;
        this.tabPanel = null;
        this.container = document.getElementById(container);
        this.tab = this.createTabButton(this.attr);
        this.tab.onclick = (evt) => this.showPanel(evt, this.tabPanel);
        this.tabLinks = document.getElementsByClassName("tab-links");
        this.tabContents = document.getElementsByClassName("tab-content");
    }

    createTabButton({id: id, text: text}) {
        let node = document.createElement("BUTTON");
        node.id = id;
        node.textContent = text;
        node.classList.add("tab-links");
        this.container.appendChild(node);
        return node;
    }

    addPanel(node) {
        this.tabPanel = node;
        this.tabPanel.classList.add("tab-content");
        this.container.after(node);
    }

    showPanel(event, tabPanel) {
        for (let idx = 0; idx < MAX_DEVICE_NUMBER; ++idx) {
            this.tabContents[idx].style.display = "none";
            this.tabLinks[idx].className = this.tabLinks[idx].className.replace(" active", "");
        }

        tabPanel.style.display = "block";
        event.currentTarget.className += " active";
    }
}

class DevicePanel {
    constructor(index, framework) {
        this.idx = index;
        this.fwk = framework;

        this.container = document.createElement("DIV");
        this.container.id = `device${this.idx + 1}`;
        this.container.innerHTML = this.panelHTML(this.idx);
        this.fwk.addPanel(this.container);

        this.mediaTypeSelector = document.getElementById(`media-type${this.idx}`);
        this.mediaTypeSelector.disabled = false;
        this.mediaTypeSelector.options[0].textContent = lang.LANG_VM_HTML5_MEDIA_NONE;
        this.mediaTypeSelector.options[1].textContent = lang.LANG_VM_HTML5_MEDIA_FOLDER;
        this.mediaTypeSelector.options[2].textContent = lang.LANG_VM_HTML5_MEDIA_ISO;
        this.mediaTypeSelector.options[3].textContent = lang.LANG_VM_HTML5_MEDIA_IMG;

        this.mediaSelectBtn = document.getElementById(`media_input_selector${this.idx}`);
        this.mediaSelectBtn.textContent = lang.LANG_VM_HTML5_SELECT;
        this.mediaInput = document.getElementById(`media_input${this.idx}`);

        this.mediaFileName = document.getElementById(`media-input-name${this.idx}`);
        this.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;

        this.mediaStatus = document.getElementById(`media-status${this.idx}`);
        this.mediaStatus.textContent = lang.LANG_VM_HTML5_DEVICE_NOT_READY;

        this.mediaPlugPullBtn = document.getElementById(`plugpull-btn${this.idx}`);
        this.mediaPlugPullBtn.textContent = lang.LANG_VM_HTML5_PLUG_IN;
    }

    panelHTML(idx) {
        return `
        <div class="device-content-wrapper">
            <div class="device-media-type-selector">
                <select id="media-type${idx}" class="media-button">
                    <option value="none"></option>
                    <option value="folder"></option>
                    <option value="iso"></option>
                    <option value="img"></option>
                </select>
            </div>
            <div class="device-media-file-name">
                <h2 id="media-input-name${idx}" class="media-input-name"></h2>
            </div>
            <div class="device-media-select-button">
                <button type="button" id="media_input_selector${idx}" class="media-button" disabled="true"></button>
                <input id="media_input${idx}" class="media-file" type="file" accept=".iso,.img,.ima"/>
            </div>
            <div class="device-plugpull-button">
                <button type="button" id="plugpull-btn${idx}" class="media-button" disabled="true"></button>
            </div>
            <div class="device-status">
                <div id="media-status${idx}" class="media-status"></div>
            </div>
        </div>
        `;
    }

    updateMediaStatus(msg) {
        this.mediaStatus.textContent = msg;
    }

    mediaPlugBtnRender(disable) {
        return this.mediaPlugPullBtnRender("plug", lang.LANG_VM_HTML5_PLUG_IN, disable);
    }

    mediaPullBtnRender(disable) {
        return this.mediaPlugPullBtnRender("pull", lang.LANG_VM_HTML5_PULL_OUT, disable);
    }

    mediaPlugPullBtnRender(action, string, disabled) {
        if (disabled) {
            if (this.mediaPlugPullBtn.classList.contains("media-button-plugin"))
                this.mediaPlugPullBtn.classList.remove("media-button-plugin");

            if (this.mediaPlugPullBtn.classList.contains("media-button-pullout"))
                this.mediaPlugPullBtn.classList.remove("media-button-pullout");
        } else {
            switch (action) {
            case "plug":
                if (this.mediaPlugPullBtn.classList.contains("media-button-pullout"))
                    this.mediaPlugPullBtn.classList.remove("media-button-pullout");
                this.mediaPlugPullBtn.classList.add("media-button-plugin");
                break;
            case "pull":
                if (this.mediaPlugPullBtn.classList.contains("media-button-plugin"))
                    this.mediaPlugPullBtn.classList.remove("media-button-plugin");
                this.mediaPlugPullBtn.classList.add("media-button-pullout");
                break;
            default:
                console.log("Unknown button action");
                break;
            }
        }

        this.mediaPlugPullBtn.disabled = disabled;
        this.mediaPlugPullBtn.textContent = string;
    }

    mediaTypeSelected() {
        if (typeof this.mediaInput.webkitdirectory !== "undefined")
            this.mediaInput.webkitdirectory = false;

        switch (this.mediaTypeSelector.value) {
        case "none":
            this.mediaSelectBtn.disabled = true;
            this.mediaPlugBtnRender(true);
            this.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;
            break;
        case "iso":
        case "img":
            this.mediaSelectBtn.disabled = false;
            break;
        case "folder":
            // IE doesn't have webkitdirectory
            // Edge and Safari doesn't support webkitRelativePath
            if (this.mediaInput.webkitdirectory == "undefined" || isEdge() || isSafari()) {
                this.mediaTypeSelector.selectedIndex = this.lastSelect;
                this.updateMediaStatus("Your browser doesn't support plug in folder");
            } else {
                this.mediaInput.webkitdirectory = true;
                this.mediaSelectBtn.disabled = false;
                this.mediaPlugBtnRender(true);
            }
            break;
        default:
            console.log("Unknown media type.");
            break;
        }
    }

    updateFileName(evt) {
        if (evt.target.files.length == 0) {
            this.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;
            return 1;
        }

        let uploadFile;
        let fileName;
        // TODO: Fix file name width and reserve file extention
        switch (this.mediaTypeSelector.value) {
            case "iso":
                uploadFile = evt.target.files[0];
                this.isISOfile(uploadFile).then((result) => {
                    if (result != true || this.getFileExtension(uploadFile.name).toLowerCase() != "iso") {
                        alert("Please select an ISO file.");
                        this.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;
                        this.mediaPlugBtnRender(true);
                    }
                });

                fileName = uploadFile.name;
                break;
            case "img":
                uploadFile = evt.target.files[0];
                let extension = this.getFileExtension(uploadFile.name).toLowerCase();

                if (extension != "img" && extension != "ima") {
                    alert("Please select an IMG/IMA file.");
                    this.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;
                    this.mediaPlugBtnRender(true);
                    return 1;
                }

                fileName = uploadFile.name;
                break;
            case "folder":
                uploadFile = evt.target.files;
                fileName = lang.LANG_VM_HTML5_SELECT_FOLDER.replace("{number}", uploadFile.length);
                break;
            default:
                alert("Unknown media type");
                this.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;
                return 1;
        }

        this.mediaFileName.textContent = fileName;
        return 0;
    }

    getFileExtension(filename) {
        return filename.split('.').pop();
    }

    async isISOfile(file) {
        const ISOSignature = "CD001";
        const ISOSignatureOffset = 32769;
        let blob = file.slice(ISOSignatureOffset, ISOSignatureOffset + ISOSignature.length);

        try {
            let buff = await this.asyncReadFileAsArrayBuffer(blob);
            let uint8 = new Uint8Array(buff);
            let Signature = uint8.reduce((acc, curr) => acc + String.fromCharCode(curr), "");
            return Signature == ISOSignature;
        } catch(err) {
            console.error(err);
            return false;
        }
    }

    asyncReadFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        })
    }
}


class DeviceControl {
    constructor(view, model, uri) {
        this.uri = uri;
        this.view = view;
        this.idx = this.view.idx;
        this.model = model;
        this.ws = new Websock();
        this.ws.on("message", () => this.model.Recv(this.idx));
        this.ws.on("open", () => this.model.Start(
            this.idx,
            this.uri.username,
            this.uri.password,
            this.uri.host,
            this.uri.protocol == "wss:" ? 443 : 80,
            0,
            this.ws
        ));

        this.ws.on("close", (evt) => {
            let code = evt.code || "unknown";
            let reason = evt.reason || "unknown";
            console.log(`WebSocket on-close (code: ${code}, reason: ${reason})`);
        });
        this.ws.on("error", (evt) => alert(`Websocket on-error: ${evt}`));

        this.ws.open(`${this.uri.origin}${this.uri.pathname}`);

        /*
           true: This devices is using by ourself.
           false: We are not using this device.
        */
        this.valid = true;
        this.selfUsing = false;
        this.lastSelect = 0; // last selected item

        this.view.mediaTypeSelector.onchange = () => this.view.mediaTypeSelected();
        this.view.mediaSelectBtn.onclick = () => this.view.mediaInput.click();
        this.view.mediaInput.onchange = (evt) => {
            if (this.view.updateFileName(evt)) {
                this.view.mediaPlugBtnRender(true);
            } else {
                this.view.mediaPlugBtnRender(false);
            }
        };

        this.deviceAction = {
            [lang.LANG_VM_HTML5_PLUG_IN]: this.plugInMedia.bind(this),
            [lang.LANG_VM_HTML5_PULL_OUT]: this.pullOutMedia.bind(this)
        };

        this.view.mediaPlugPullBtn.onclick = (evt) => this.deviceAction[evt.target.innerText]();
    }

    available(bool, msg) {
        if (bool) {
            if (!this.valid) {
                this.valid = true;
                this.view.mediaTypeSelector.disabled = false;
            }
        } else {
            if (this.valid) {
                this.valid = false;
                this.view.mediaTypeSelector.disabled = true;
                this.view.mediaTypeSelector.value = "none";
                this.view.mediaSelectBtn.disabled = true;
                this.view.mediaInput.value = "";
                this.view.mediaPlugBtnRender(true);
                this.view.mediaFileName.textContent = lang.LANG_VM_HTML5_NO_MEDIA_SELECT;
            }
        }

        this.view.updateMediaStatus(msg);
    }

    plugInMedia() {
        let fileObj = this.view.mediaInput.files;
        switch (this.view.mediaTypeSelector.value) {
            case "iso":
                let isoFileObj = fileObj[0];
                this.model.Mount(this.idx, 0, isoFileObj, "ISO File",
                                  decodeURI(this.uri.username),
                                  decodeURI(this.uri.password),
                                  this.uri.host);
                break;
            case "folder":
                let folderFileObj = fileObj;
                this.model.Mount(this.idx, 1, folderFileObj, "Folder",
                                  decodeURI(this.uri.username),
                                  decodeURI(this.uri.password),
                                  this.uri.host);
                break;
            case "img":
                let imgFileObj = fileObj[0];
                this.model.Mount(this.idx, 2, imgFileObj, "IMG File",
                                  decodeURI(this.uri.username),
                                  decodeURI(this.uri.password),
                                  this.uri.host);
                break;
            default:
                alert("Please select a media type!");
                return;
        }

        this.view.updateMediaStatus(lang.LANG_VM_HTML5_PLUGING);
        this.view.mediaPlugPullBtnRender(null, lang.LANG_VM_HTML5_PLUG_PULL_PROCESS, true);
    }

    pullOutMedia() {
        this.model.Unmount(this.idx,
                            decodeURI(this.uri.username),
                            decodeURI(this.uri.password),
                            this.uri.host);

        this.view.updateMediaStatus(lang.LANG_VM_HTML5_PULLING);
        this.view.mediaPlugPullBtnRender(null, lang.LANG_VM_HTML5_PLUG_PULL_PROCESS, true);
    }

    onReady() {
        Util.loading(false);
        this.view.mediaTypeSelector.disabled = false;
        this.view.updateMediaStatus(lang.LANG_VM_HTML5_DEVICE_READY);
    }

    onPlugIn() {
        this.selfUsing = true;
        this.valid = false;
        this.view.mediaTypeSelector.disabled = true;
        this.view.mediaSelectBtn.disabled = true;
        this.view.updateMediaStatus(lang.LANG_VM_HTML5_PLUG_SUCCESS);
        this.view.container.classList.add("tab-content-active");

        setTimeout(() => {
            this.view.mediaPullBtnRender(false);
        }, 500);

    }

    onPullout() {
        this.selfUsing = false;
        this.valid = true;
        this.view.mediaTypeSelector.disabled = false;
        this.view.mediaSelectBtn.disabled = false;
        this.view.updateMediaStatus(lang.LANG_VM_HTML5_PULL_SUCCESS);
        this.view.container.classList.remove("tab-content-active");

        setTimeout(() => {
            this.view.updateMediaStatus(lang.LANG_VM_HTML5_DEVICE_READY);
            this.view.mediaPlugBtnRender(false);
        }, 500);
    }

    onError(msg) {
        Util.loading(false);
        this.view.mediaSelectBtn.disabled = true;

        this.view.mediaPlugBtnRender(true);
        console.error(msg);
        alert(`Virtual media on-error: ${msg}`);
    }

    onProcess(msg) {
        let status = `${msg} bytes (${this.readableBytes(msg)}) sent`;
        this.view.updateMediaStatus(status);
    }

    readableBytes(bytes) {
        if (bytes == 0) return 'n/a';

        let units = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
        let log1024 = (bytes) => Math.log(bytes) / Math.log(1024);
        let expo = parseInt(Math.floor(log1024(bytes)));

        if (expo == 0) return `${bytes} ${units[expo]}`;
        else           return `${(bytes / Math.pow(1024, expo)).toFixed(2)} ${units[expo]}`;
    }

    terminate() {
        if (this.model != null) {
            if (this.valid == false)
                this.model.Unmount(this.idx,
                                   decodeURI(this.uri.username),
                                   decodeURI(this.uri.password),
                                   this.uri.host);

            this.model.Stop();
            this.model = null;
        }

        if (this.ws != null) {
            this.ws.close();
            this.ws = null;
        }
    }
}

class MediaWatcher extends Websock {
    constructor(controller, interval) {
        super();
        this.medias = controller;
        this.interval = interval * ONE_SEC_MS;
        this.queryTimeID = -1;
        this.on("open", () => {
            this.queryStatus();
            this.queryTimeID = setInterval(() => this.queryStatus(), this.interval);
        });
        this.on("message", () => this.updateStatus(this.medias));
        this.on("close", (evt) => {
            let code = evt.code || "unknown";
            let reason = evt.reason || "unknown";
            console.log(`WebSocket on-close (code: ${code}, reason: ${reason})`);
            window.clearInterval(this.queryTimeID);
        });
        this.on("error", (evt) => alert(`WebSocket on-error: ${evt}`));
    }

    anyMediaInUsed() {
        return this.medias.some(dev => dev.valid == false);
    }

    queryStatus() {
        const PDU_CMD_GET_USB_INFO = [0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00];
        if (super.state() === WebSocket.OPEN) {
            return this.send(PDU_CMD_GET_USB_INFO);
        } else {
            console.log("Websocket is not established");
        }
    }

    updateStatus(medias) {
        let dataBuff = new Uint8Array(this.rQshiftBytes(8));
        let length = dataBuff[4] +
            (dataBuff[5] << 8) +
            (dataBuff[6] << 16) +
            (dataBuff[7] << 24);

        dataBuff = new Uint8Array(this.rQshiftBytes(length));

        let maxSupportDev = dataBuff[0];
        let devicesType = dataBuff.slice(1);

        for (let dev = 0; dev < MAX_DEVICE_NUMBER; dev++) {
            // If this device is using by ourself, skip update.
            if (medias[dev].selfUsing == true) continue;

            if (devicesType[dev] == MEDIA_TYPE.NONE) {
                medias[dev].available(true, lang.LANG_VM_HTML5_DEVICE_READY);
            } else {
                medias[dev].available(false, lang.LANG_VM_HTML5_IN_USE);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Util.loading(true);

    const vmTitle = document.getElementById("vm-title");
    vmTitle.textContent = lang.LANG_VM_HTML5_CAPTION;

    const warnSlogan = document.getElementById("warning-slogan");
    warnSlogan.textContent = lang.LANG_VM_HTML5_WARN;

    vm = new VM();
    vm.Init(0x57, 0, 0);

    let devicesControl = [];
    const usbUsbServerWebSocket = 0;
    const host = Util.getQueryVar('host', window.location.host);
    const username = 'PlaceholderForWebSessionId      ';
    const password = username;
    let path = Util.getQueryVar('path', 'vm_websocket_srv');
    let encrypt = window.location.protocol === "https:";
    let protocol = encrypt ? "wss:" : "ws:";


    let uri = `${protocol}//${username}:${password}@${host}/${path}`;

    for (let idx = 0; idx < MAX_DEVICE_NUMBER; idx++) {
        devicesControl[idx] = new DeviceControl(
            new DevicePanel(
                idx,
                new Tabs(
                {
                    "id": `device-tab${idx + 1}`,
                    "text": lang[`LANG_VM_HTML5_DEVICE${idx + 1}`]
                },
                "device-tabs")),
            vm,
            new URL(uri));
    }

    vm.on('ready', (idx) => devicesControl[idx].onReady());
    vm.on('mount', (idx) => devicesControl[idx].onPlugIn());
    vm.on('unmount', (idx) => devicesControl[idx].onPullout());
    vm.on('error', (msg, idx) => devicesControl[idx].onError(msg));
    vm.on('process', (msg, idx) => devicesControl[idx].onProcess(msg));

    let watcher = new MediaWatcher(devicesControl, 5);
    watcher.open(uri);

    // TODO
    document.getElementById("device-tab1").click();


    window.onbeforeunload = () => {
        for (let i = 0; i < MAX_DEVICE_NUMBER; i++) {
            devicesControl[i].terminate();
        }
        watcher.close();
    };
});
