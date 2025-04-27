
/*jslint white: false */
/*global window, $, Util, RFB, */
"use strict";

import RFB from '../core/rfb.js';
import KeyMacros from "/novnc/ui/keymacros.js";
import * as WebUtil from "../app/webutil.js";

let rfb;
var desktopName;
var fpsArray = new Array();
var macroOpen = false;
var keymacros;
var kvmToken;
var sessionID;
var title_msg = (function(){
    "use strict";
    var msg = new Object();
    msg.title = "iKVM over HTML5";
    msg.view_only = "";
    msg.status = "";
    msg.fps = "0";
    msg.res = "Unknown";
    msg.kblang = "Unknown";
    msg.display_status = function() {
        "use strict";
        document.title =
                        msg.view_only +
                        ""        + msg.status;
    };
    msg.display_short = function() {
        "use strict";
        document.title =
                        msg.view_only +
                        " Res:"    + msg.res +
                        " FPS:"    + msg.fps +
                        " KB:"     + msg.kblang;
    };
    msg.set_fps = function(fps) {
        "use strict";
        msg.fps = fps;
        msg.display_short();
    };
    msg.set_res = function(res) {
        "use strict";
        msg.res = res;
        msg.display_short();
    };
    msg.set_kblang = function(kblang) {
        "use strict";
	msg.kblang = kblang;
	msg.display_short();
    }
    msg.set_status = function(status) {
        "use strict";
        msg.status = status;
        msg.display_status();
    };
    msg.set_view_only = function(view_only){
        "use strict";
        msg.view_only = view_only;
    };
    return msg;
})();

// When this function is called we have
// successfully connected to a server
function connectedToServer(e) {
    "use strict";
    updateState("Connected to " + desktopName);
}

// This function is called when we are disconnected
function disconnectedFromServer(e) {
    "use strict";
    if (e.detail.clean) {
        updateState("Disconnected");
    } else if (e.detail.reason != "") {
        updateState(e.detail.reason);
    } else {
        updateState("Something went wrong, connection is closed");
    }
}

// When this function is called, the server requires
// credentials to authenticate
function credentialsAreRequired(e) {
    "use strict";
    console.log("credentialsAreRequired");
    const password = prompt("Password Required:");
    rfb.sendCredentials({ password: password });
}

// When this function is called we have received
// a desktop name from the server
function updateDesktopName(e) {
    "use strict";
    desktopName = e.detail.name;
}

function viewOnly() {
    "use strict";
    title_msg.set_view_only("(Video Only)");
}

function passwordRequired(rfb) {
    "use strict";
    var msg;
    msg = '<form onsubmit="return setPassword();"';
    msg += '  style="margin-bottom: 0px">';
    msg += 'Password Required: ';
    msg += '<input type=password size=10 id="password_input" class="iKVM_status">';
    msg += '<\/form>';
    $D('iKVM_status_bar').setAttribute("class", "iKVM_status_warn");
    $D('iKVM_status').innerHTML = msg;
}
function setPassword() {
    "use strict";
    rfb.sendPassword($D('password_input').value);
    return false;
}
function sendPowerOnOff(powerSel) {
    "use strict";
    rfb.sendPowerOnOff(powerSel);
    return false;
}
function sendCtrlAltDel() {
    "use strict";
    rfb.sendCtrlAltDel();
    return false;
}
function sendMacro(macro) {
    "use strict";
    rfb.sendMacro(macro);
    return false;
}
function sendKeyHold(key, hold) {
    "use strict";
    rfb.sendKeyHold(key, hold);
}
function sendKMHotplug() {
    "use strict";
    rfb.sendKMHotplug();
    return false;
}
function sendKBLangSelect(kbLangSel) {
    "use strict";
	rfb.sendKBLangSelect(kbLangSel);
	return true;
}

function updateState(msg) {
    "use strict";
    if (typeof(msg) !== 'undefined') {
        title_msg.set_status(msg);
    }
}

function displayBlur() {
    "use strict";
    rfb.get_keyboard().set_focused(false);
    rfb.get_mouse().set_focused(false);
}

function displayFocus() {
    "use strict";
    rfb.get_keyboard().set_focused(true);
    rfb.get_mouse().set_focused(true);
}

function updateFps(event) {
    "use strict";
    title_msg.set_fps(event.detail);
}
function updateRes(event) {
    "use strict";
    title_msg.set_res(event.detail.width+"x"+event.detail.height);
}
function updateKBLang(event) {
    "use strict";
	title_msg.set_kblang(event.detail);
}
function toggleMacroPanel() {
    "use strict";
    if (macroOpen) {
        closeMacroMenu();
    } else {
        openMacroMenu();
    }
}

// Open menu
function openMacroMenu() {
    "use strict";
    $D('macroMenu').style.display = "block";
    macroOpen = true;
}

// Close menu (without applying settings)
function closeMacroMenu() {
    "use strict";
  $D('macroMenu').style.display = "none";
  macroOpen = false;
}

function addMouseHandlers() {
    "use strict";

  $D("macroMenuPanel").onmouseover = displayBlur;
  $D("macroMenuPanel").onmouseover = displayFocus;
}

function responseKVMToken(originalRequest){
    "use strict";
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        // check session & privilege
        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        kvmToken = IPMIRoot.getAttribute('KVM_TOKEN_NAME');
        connect();
    }
}

//call the CGI to create a KVM one-time token and ruturn it.
function getKvmToken(){
    "use strict";
    var url = '/cgi/getkvmtoken.cgi';
    var pars = 'time_stamp=' + (new Date());
    var myAjax = new Ajax.Request(url, {
        method: 'POST',
        contentType: "text/xml",
        xml_data: window.opener.QueryXML,
        timeout: g_CGIRequestTimeout,
        ontimeout: onCGIRequestTimeout,
        parameters: pars,
        onComplete: responseKVMToken
    });
}

window.onload = function () {
    "use strict";
    // get KVM one-time token
    getKvmToken();
}

function connect() {
    "use strict";
    let host, port, path, token, sid;

    keymacros = new KeyMacros(sendMacro);
    //var itemdata = findItemdataMacroDefined();
    //keymacros.InitMacroBtns(itemdata, DefItemobjByName, DrawMenuBar);

    // avoid empty and no Complete func in keymacros
    DrawMenuBar();
    InitDragDrop();

    WebUtil.init_logging(WebUtil.getQueryVar('logging', 'warn'));
    document.title = unescape(WebUtil.getQueryVar('title', 'iKVM over HTML5'));
    // By default, use the host and port of server that served this file
    host = WebUtil.getQueryVar('host', window.location.hostname);
    port = WebUtil.getQueryVar('port', window.location.port);

    // if port == 80 (or 443) then it won't be present and should be
    // set manually
    if (!port) {
        if (window.location.protocol.substring(0,5) == 'https') {
            port = 443;
        }
        else if (window.location.protocol.substring(0,4) == 'http') {
            port = 80;
        }
    }

    // If a token variable is passed in, set the parameter in a cookie.
    // This is used by nova-novncproxy.
    token = WebUtil.getQueryVar('token', null);
    if (token) {
        WebUtil.createCookie('token', token, 1);
    }

    sid = "PlaceholderForWebSessionId";
    path = WebUtil.getQueryVar('path', 'websocket_srv');     // insyde ikvm html5 websocket

    if ((!host) || (!port)) {
        console.log("Must specify host and port in URL");
        updateState('failed',
            "Must specify host and port in URL");
        return;
    }

    let url;
    if (window.location.protocol === "https:") {
        url = 'wss';
    } else {
        url = 'ws';
    }
    url += '://' + host;
    if(port) {
        url += ':' + port;
    }
    url += '/' + path;

    rfb = new RFB(document.getElementById('iKVM_screen'), url, { credentials: { username:sid, password: sid, kvmToken: kvmToken } });

    rfb.addEventListener("connect",  connectedToServer);
    rfb.addEventListener("disconnect", disconnectedFromServer);
    rfb.addEventListener("credentialsrequired", credentialsAreRequired);
    rfb.addEventListener("desktopname", updateDesktopName);
    rfb.addEventListener("fps", updateFps);
    rfb.addEventListener("res", updateRes);
    rfb.addEventListener("kblang", updateKBLang);
    rfb.addEventListener("viewonly", viewOnly);

    // Set parameters that can be changed on an active connection
    rfb.viewOnly = WebUtil.getQueryVar('view_only', false);
    rfb.scaleViewport = WebUtil.getQueryVar('scale', false);
    initializeMenu(rfb, keymacros);
};
